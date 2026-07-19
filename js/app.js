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
import { de } from "./commands/lang/de.js";
import { it } from "./commands/lang/it.js";
import { zh } from "./commands/lang/zh.js";
import { ja } from "./commands/lang/ja.js";
import { Storage } from "./storage.js";
import { copyText } from "./exporter.js";
import { exportTxt } from "./export/txt.js";
import { createFormats } from "./export/formats.js";
import { createExportMenu } from "./export/menu.js";
import { createHelp } from "./help.js";
import { tidy } from "./text-ops.js";
import { AudioMeter } from "./audioMeter.js";
import { Reader } from "./tts.js";
import { DocStore } from "./docs.js";
import { createDocsPanel } from "./docsPanel.js";

const LEXICONS = { es, en, fr, pt, de, it, zh, ja };

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
    variantTag: document.getElementById("variantTag"),
    saveState: document.getElementById("saveState"),
    copyBtn: document.getElementById("copyBtn"),
    readBtn: document.getElementById("readBtn"),
    micLevelBar: document.getElementById("micLevelBar"),
    exportBtn: document.getElementById("exportBtn"),
    exportMenu: document.getElementById("exportMenu"),
    docsBtn: document.getElementById("docsBtn"),
    docs: document.getElementById("docs"),
    docsList: document.getElementById("docsList"),
    docsTitle: document.getElementById("docsTitle"),
    docsNew: document.getElementById("docsNew"),
    docsClose: document.getElementById("docsClose"),
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

  // --- Idioma activo: familia (léxico/interfaz) + variante regional
  // (solo cambia el código que recibe SpeechRecognition). Persistidos
  // por separado: la variante exacta ("speakly:lang") y, por familia,
  // la última variante elegida ("speakly:variants"), para que volver a
  // un idioma no resetee la región que ya habías elegido ahí. ---
  const familyKeys = Object.keys(config.families);
  const langStorage = new Storage({ key: "speakly:lang" });
  const variantStorage = new Storage({ key: "speakly:variants" });

  function loadVariantPrefs() {
    try {
      return JSON.parse(variantStorage.load() || "{}");
    } catch (_) {
      return {};
    }
  }
  const variantPrefs = loadVariantPrefs();

  function findByCode(code) {
    for (const key of familyKeys) {
      const idx = config.families[key].variants.findIndex((v) => v.code === code);
      if (idx !== -1) return { familyKey: key, variantIndex: idx };
    }
    return null;
  }

  const savedCode = langStorage.load();
  const resolved = findByCode(savedCode) || findByCode(config.defaultVariant);
  let familyKey = resolved.familyKey;
  let variantIndex = resolved.variantIndex;

  const family = () => config.families[familyKey];
  const variant = () => family().variants[variantIndex];
  let t = strings[family().lexicon];

  // --- Documentos: varios en localStorage, uno abierto a la vez ---
  const docs = new DocStore();
  let currentDocId = docs.available ? docs.currentId() || docs.create("") : null;

  // --- Editor ---
  const editor = new Editor(els.editor, {
    scrollEl: els.sheet,
    onChange: () => {
      els.count.textContent = String(editor.getWordCount());
      if (docs.available && currentDocId) {
        setSaveState(t.savingState);
        docs.saveDebounced(currentDocId, editor.getText(), () => setSaveState(t.savedState));
      }
    },
  });

  const savedText = docs.available ? docs.load(currentDocId) : "";
  if (savedText) editor.setText(savedText);
  setSaveState(docs.available ? (savedText ? t.savedState : "") : t.noSaveState);

  // --- Motor de comandos ---
  const history = new History(editor);
  let parser = createParser(LEXICONS[family().lexicon]);
  const engine = new CommandEngine({
    editor,
    history,
    parser,
    onSwitchLanguage: (familyCode) => switchFamily(familyCode),
  });

  // --- Panel de documentos ---
  function loadDocument(id) {
    currentDocId = id;
    docs.setCurrentId(id);
    editor.setText(docs.load(id));
    history.clear();
    engine.resetFormatState();
    setSaveState(t.savedState);
  }

  function createDocument() {
    const id = docs.create("");
    loadDocument(id);
    editor.focus();
  }

  function removeDocument(id) {
    const wasCurrent = id === currentDocId;
    docs.remove(id);
    if (wasCurrent) {
      const next = docs.currentId() || docs.create("");
      loadDocument(next);
    }
  }

  createDocsPanel({
    store: docs,
    t,
    getCurrentId: () => currentDocId,
    onOpen: loadDocument,
    onCreate: createDocument,
    onRemove: removeDocument,
    els: {
      overlay: els.docs,
      list: els.docsList,
      title: els.docsTitle,
      newBtn: els.docsNew,
      openBtn: els.docsBtn,
      closeBtn: els.docsClose,
    },
  });

  // --- Panel de comandos ---
  const help = createHelp({
    lexicon: LEXICONS[family().lexicon],
    t,
    families: config.families,
    els: {
      overlay: els.help,
      body: els.helpBody,
      title: els.helpTitle,
      intro: els.helpIntro,
      openBtn: els.helpBtn,
      closeBtn: els.helpClose,
    },
  });

  // --- Menú de exportar ---
  const formats = createFormats({
    getLang: () => variant().code,
    getTitle: () => t.title,
  });
  const exportMenu = createExportMenu({
    formats,
    getText: () => tidy(editor.getText()),
    els: { toggle: els.exportBtn, menu: els.exportMenu, list: els.exportMenu },
  });
  exportMenu.build(t);

  // --- Reconocimiento ---
  const speech = new SpeechController({
    lang: variant().code,
    onInterim: (text) => editor.setInterim(text),
    onFinal: (text) => engine.process(text),
    onState: (state) => setStatus(state),
    onError: (err) => handleError(err),
  });

  // --- Medidor de nivel de audio (no afecta el reconocimiento, es
  // solo feedback visual — ver audioMeter.js) ---
  const meter = new AudioMeter({
    onLevel: (v) => {
      els.micLevelBar.style.transform = `scaleX(${v})`;
    },
  });

  // --- Leer en voz alta (SpeechSynthesis) ---
  const reader = new Reader({
    onState: (state) => {
      const readingNow = state === "reading";
      els.readBtn.textContent = readingNow ? t.stop : t.read;
      els.micBtn.disabled = readingNow; // evita que el mic capte la lectura
    },
  });
  els.readBtn.addEventListener("click", () => {
    if (reader.speaking) {
      reader.stop();
    } else {
      reader.speak(tidy(editor.getText()), variant().code);
    }
  });

  // --- Textos de interfaz (todo lo que no depende del léxico de comandos) ---
  function applyUiStrings() {
    document.title = t.title;
    els.langTag.textContent = familyKey;
    els.langTag.dataset.label = t.langLabel;
    els.langTag.setAttribute("aria-label", t.langSwitchAria);
    els.langTag.title = family().label;

    const v = variant();
    const region = v.code.split("-")[1] || v.code;
    els.variantTag.textContent = region;
    els.variantTag.dataset.label = t.variantLabel;
    els.variantTag.setAttribute("aria-label", t.variantSwitchAria);
    els.variantTag.title = v.label;
    els.variantTag.hidden = family().variants.length <= 1;

    els.docsBtn.textContent = t.docs;
    els.helpBtn.textContent = t.help;
    els.copyBtn.textContent = t.copy;
    els.readBtn.textContent = reader.speaking ? t.stop : t.read;
    els.exportBtn.textContent = t.export;
    els.editor.placeholder = t.editorPlaceholder;
    els.editor.setAttribute("aria-label", t.editorAriaLabel);
    els.count.dataset.label = t.wordsLabel;
    els.toastClose.setAttribute("aria-label", t.toastCloseAria);
  }
  applyUiStrings();

  function persistLanguage() {
    langStorage.save(variant().code);
    variantPrefs[familyKey] = variantIndex;
    variantStorage.save(JSON.stringify(variantPrefs));
  }

  // --- Selector de familia de idioma (cicla es→en→fr→...→es) ---
  els.langTag.addEventListener("click", () => {
    const next = familyKeys[(familyKeys.indexOf(familyKey) + 1) % familyKeys.length];
    switchFamily(next);
  });

  // --- Selector de variante regional (cicla dentro de la familia activa) ---
  els.variantTag.addEventListener("click", () => {
    const n = family().variants.length;
    variantIndex = (variantIndex + 1) % n;
    applyUiStrings();
    speech.setLang(variant().code);
    persistLanguage();
  });

  function switchFamily(newFamilyKey) {
    if (!config.families[newFamilyKey]) return;
    familyKey = newFamilyKey;
    variantIndex = variantPrefs[familyKey] ?? 0;
    if (variantIndex >= family().variants.length) variantIndex = 0;
    t = strings[family().lexicon];

    applyUiStrings();
    parser = createParser(LEXICONS[family().lexicon]);
    engine.parser = parser;
    help.setLexicon(LEXICONS[family().lexicon], t);
    exportMenu.build(t);
    speech.setLang(variant().code);
    setStatus(speech.listening ? "listening" : "idle");
    persistLanguage();
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
    els.readBtn.disabled = listening; // evita que la lectura se mezcle con el dictado

    if (listening) meter.start();
    else meter.stop();
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
