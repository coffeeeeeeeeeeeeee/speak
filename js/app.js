// ============================================================
// app.js
// Orquestación completa: andamiaje + dictado continuo + comandos +
// persistencia + panel de ayuda + avisos.
// ============================================================

import { config } from "./config.js";
import { SpeechController, isSupported } from "./recognition.js";
import { Editor } from "./editor.js";
import { History } from "./history.js";
import { createParser } from "./commands/parser.js";
import { CommandEngine } from "./commands/engine.js";
import { es } from "./commands/lang/es.js";
import { Storage } from "./storage.js";
import { exportTxt, copyText } from "./exporter.js";
import { createHelp } from "./help.js";
import { tidy } from "./text-ops.js";

const LEXICONS = { es };

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
    helpClose: document.getElementById("helpClose"),
    toast: document.getElementById("toast"),
    toastMsg: document.getElementById("toastMsg"),
    toastClose: document.getElementById("toastClose"),
  };

  const lang = config.languages[config.defaultLang];
  els.langTag.textContent = lang.short;

  // --- Persistencia ---
  const storage = new Storage();

  // --- Editor ---
  const editor = new Editor(els.editor, {
    scrollEl: els.sheet,
    onChange: () => {
      els.count.textContent = String(editor.getWordCount());
      if (storage.available) {
        setSaveState("guardando…");
        storage.saveDebounced(editor.getText(), () => setSaveState("guardado"));
      }
    },
  });

  const saved = storage.load();
  if (saved) editor.setText(saved);
  setSaveState(storage.available ? (saved ? "guardado" : "") : "sin guardado");

  // --- Motor de comandos ---
  const history = new History(editor);
  const lexicon = LEXICONS[lang.lexicon];
  const parser = createParser(lexicon);
  const engine = new CommandEngine({ editor, history, parser });

  // --- Panel de comandos ---
  const help = createHelp({
    lexicon,
    els: {
      overlay: els.help,
      body: els.helpBody,
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

  // --- Estados ---
  function setStatus(state, message) {
    const labels = {
      listening: "escuchando",
      idle: "en pausa",
      error: message || "error",
    };
    els.dot.dataset.state = state === "error" ? "error" : state;
    els.statusText.textContent = labels[state] || state;

    const listening = state === "listening";
    els.micBtn.setAttribute("aria-pressed", String(listening));
    els.micLabel.textContent = listening ? "Detener" : "Dictar";
  }

  function handleError(err) {
    setStatus("error", "micrófono");
    if (err.type === "permission") {
      showToast(
        "Permiso de micrófono denegado. Activalo en el ícono de la barra de direcciones y volvé a pulsar «Dictar».",
        { persist: true }
      );
    } else if (err.type === "network") {
      showToast("Sin conexión: el reconocimiento necesita internet.");
    } else {
      showToast(err.message || "Error de reconocimiento.");
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
    flashLabel(els.copyBtn, ok ? "Copiado" : "No se pudo");
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
