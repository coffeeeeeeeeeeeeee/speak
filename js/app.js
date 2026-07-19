// ============================================================
// app.js
// Orquestación completa: andamiaje + dictado continuo + comandos +
// persistencia + panel de ayuda + avisos + selector de idioma.
// ============================================================

import { config } from "./config.js";
import { strings } from "./i18n.js";
import { SpeechController, isSupported } from "./recognition.js";
import { Editor } from "./editor.js";
import { History } from "./history.js";
import { createParser } from "./commands/parser.js";
import { CommandEngine } from "./commands/engine.js";
import { es } from "./commands/lang/es.js";
import { en } from "./commands/lang/en.js";
import { fr } from "./commands/lang/fr.js";
import { pt } from "./commands/lang/pt.js";
import { Storage } from "./storage.js";
import { exportTxt, copyText } from "./exporter.js";
import { createHelp } from "./help.js";
import { tidy } from "./text-ops.js";

const LEXICONS = { es, en, fr, pt };

if (!isSupported()) {
  document.getElementById("unsupported").hidden = false;
  document.getElementById("app").style.display = "none";
} else {
  initApp();
}

function initApp() {
  const els = {
    editor: document.getElementById("editor"),
    sheet: document.getElementById("sheet"),
    dot: document.getElementById("dot"),
    statusText: document.getElementById("statusText"),
    count: document.getElementById("count"),
    micBtn: document.getElementById("micBtn"),
    micLabel: document.getElementById("micLabel"),
    langTag: document.getElementById("langTag"),
    saveState: document.getElementById("saveState"),
    copyBtn: document.getElementById("copyBtn"),
    exportBtn: document.getElementById("exportBtn"),
    helpBtn: document.getElementById("helpBtn"),
    help: document.getElementById("help"),
    helpBody: document.getElementById("helpBody"),
    helpTitle: document.getElementById("helpTitle"),
    helpIntro: document.getElementById("helpIntro"),
    helpClose: document.getElementById("helpClose"),
    toast: document.getElementById("toast"),
    toastMsg: document.getElementById("toastMsg"),
    toastClose: document.getElementById("toastClose"),
  };

  // --- Idioma activo (persistido; si no hay uno guardado, el default) ---
  const langStorage = new Storage({ key: "speakly:lang" });
  const savedCode = langStorage.load();
  let lang = config.languages[savedCode] || config.languages[config.defaultLang];
  let t = strings[lang.lexicon];

  // --- Persistencia del documento ---
  const storage = new Storage();

  // --- Editor ---
  const editor = new Editor(els.editor, {
    scrollEl: els.sheet,
    onChange: () => {
      els.count.textContent = String(editor.getWordCount());
      if (storage.available) {
        setSaveState(t.savingState);
        storage.saveDebounced(editor.getText(), () => setSaveState(t.savedState));
      }
    },
  });

  const saved = storage.load();
  if (saved) editor.setText(saved);
  setSaveState(storage.available ? (saved ? t.savedState : "") : t.noSaveState);

  // --- Motor de comandos ---
  const history = new History(editor);
  let parser = createParser(LEXICONS[lang.lexicon]);
  const engine = new CommandEngine({ editor, history, parser });

  // --- Panel de comandos ---
  const help = createHelp({
    lexicon: LEXICONS[lang.lexicon],
    t,
    els: {
      overlay: els.help,
      body: els.helpBody,
      title: els.helpTitle,
      intro: els.helpIntro,
      openBtn: els.helpBtn,
      closeBtn: els.helpClose,
    },
  });

  // --- Reconocimiento ---
  const speech = new SpeechController({
    lang: lang.code,
    onInterim: (text) => editor.setInterim(text),
    onFinal: (text) => engine.process(text),
    onState: (state) => setStatus(state),
    onError: (err) => handleError(err),
  });

  // --- Textos de interfaz (todo lo que no depende del léxico de comandos) ---
  function applyUiStrings() {
    document.title = t.title;
    els.langTag.textContent = lang.short;
    els.langTag.dataset.label = t.langLabel;
    els.langTag.setAttribute("aria-label", t.langSwitchAria);
    els.helpBtn.textContent = t.help;
    els.copyBtn.textContent = t.copy;
    els.exportBtn.textContent = t.export;
    els.editor.placeholder = t.editorPlaceholder;
    els.editor.setAttribute("aria-label", t.editorAriaLabel);
    els.count.dataset.label = t.wordsLabel;
    els.toastClose.setAttribute("aria-label", t.toastCloseAria);
  }
  applyUiStrings();

  // --- Selector de idioma ---
  els.langTag.addEventListener("click", () => {
    const codes = Object.keys(config.languages);
    const next = codes[(codes.indexOf(lang.code) + 1) % codes.length];
    switchLanguage(next);
  });

  function switchLanguage(code) {
    lang = config.languages[code] || config.languages[config.defaultLang];
    t = strings[lang.lexicon];

    applyUiStrings();
    parser = createParser(LEXICONS[lang.lexicon]);
    engine.parser = parser;
    help.setLexicon(LEXICONS[lang.lexicon], t);
    speech.setLang(lang.code);
    setStatus(speech.listening ? "listening" : "idle");
    langStorage.save(lang.code);
  }

  // --- Estados ---
  function setStatus(state, message) {
    const labels = {
      listening: t.statusListening,
      idle: t.statusIdle,
      error: message || t.statusError,
    };
    els.dot.dataset.state = state === "error" ? "error" : state;
    els.statusText.textContent = labels[state] || state;

    const listening = state === "listening";
    els.micBtn.setAttribute("aria-pressed", String(listening));
    els.micLabel.textContent = listening ? t.stop : t.dictate;
  }

  function handleError(err) {
    setStatus("error", t.micError);
    if (err.type === "permission") {
      showToast(t.permissionDenied, { persist: true });
    } else if (err.type === "network") {
      showToast(t.networkError);
    } else {
      const detail = err.code ? ` (${err.code})` : "";
      showToast(t.genericError + detail);
    }
  }

  function setSaveState(text) {
    els.saveState.textContent = text;
  }

  // --- Toast ---
  let toastTimer = null;
  function showToast(message, { persist = false } = {}) {
    els.toastMsg.textContent = message;
    els.toast.hidden = false;
    clearTimeout(toastTimer);
    if (!persist) toastTimer = setTimeout(hideToast, 5000);
  }
  function hideToast() {
    els.toast.hidden = true;
    clearTimeout(toastTimer);
  }
  els.toastClose.addEventListener("click", hideToast);

  function flashLabel(btn, temp) {
    const original = btn.textContent;
    btn.textContent = temp;
    setTimeout(() => {
      btn.textContent = original;
    }, 1400);
  }

  // --- Micrófono ---
  els.micBtn.addEventListener("click", () => {
    hideToast();
    speech.toggle();
    if (speech.listening) editor.focus();
  });

  // --- Copiar / Exportar (con limpieza de espaciado) ---
  els.copyBtn.addEventListener("click", async () => {
    const ok = await copyText(tidy(editor.getText()));
    flashLabel(els.copyBtn, ok ? t.copied : t.copyFailed);
  });

  els.exportBtn.addEventListener("click", () => {
    exportTxt(tidy(editor.getText()));
  });

  // --- Atajos de teclado ---
  window.addEventListener("keydown", (e) => {
    const ctrl = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    if (ctrl && key === "j") {
      e.preventDefault();
      els.micBtn.click();
      return;
    }
    if (ctrl && key === "s") {
      e.preventDefault();
      exportTxt(tidy(editor.getText()));
      return;
    }
    if (ctrl && key === "/") {
      e.preventDefault();
      help.isOpen() ? help.close() : help.open();
      return;
    }
    if (ctrl && key === "z" && !e.shiftKey) {
      if (engine.canUndo()) {
        e.preventDefault();
        engine.undo();
      }
    } else if (ctrl && (key === "y" || (key === "z" && e.shiftKey))) {
      if (engine.canRedo()) {
        e.preventDefault();
        engine.redo();
      }
    }
  });

  setStatus("idle");
  els.count.textContent = String(editor.getWordCount());
}
