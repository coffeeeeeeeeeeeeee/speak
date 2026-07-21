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
import { tidy, wordSpanAt } from "./text-ops.js";
import { AudioMeter } from "./audioMeter.js";
import { Reader } from "./tts.js";
import { DocStore } from "./docs.js";
import { createDocsPanel } from "./docsPanel.js";
import { currentTheme, setTheme, themeLabel, applyCustomTheme } from "./theme.js";
import { themes } from "./themes.js";
import { createThemeEditor } from "./themeEditor.js";
import { prependIcon, iconMarkup } from "./icons.js";
import { createDropdown, renderMenuItems } from "./dropdown.js";

const LEXICONS = { es, en, fr, pt, de, it, zh, ja };

// Instalable como app + funciona sin conexión (salvo el dictado en sí,
// que siempre necesita internet). Independiente de si el navegador
// soporta reconocimiento de voz o no.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

if (!isSupported()) {
  document.getElementById("unsupported").hidden = false;
  document.getElementById("app").style.display = "none";
} else {
  initApp();
}

function initApp() {
  const els = {
    editor: document.getElementById("editor"),
    editorOverlay: document.getElementById("editorOverlay"),
    editToolbarToggle: document.getElementById("editToolbarToggle"),
    editToolbar: document.getElementById("editToolbar"),
    styleSelect: document.getElementById("styleSelect"),
    fmtBold: document.getElementById("fmtBold"),
    fmtItalic: document.getElementById("fmtItalic"),
    fmtStrike: document.getElementById("fmtStrike"),
    fmtUnderline: document.getElementById("fmtUnderline"),
    alignLeftBtn: document.getElementById("alignLeftBtn"),
    alignCenterBtn: document.getElementById("alignCenterBtn"),
    alignRightBtn: document.getElementById("alignRightBtn"),
    alignJustifyBtn: document.getElementById("alignJustifyBtn"),
    toolbarUndoBtn: document.getElementById("toolbarUndoBtn"),
    toolbarRedoBtn: document.getElementById("toolbarRedoBtn"),
    sheet: document.getElementById("sheet"),
    dot: document.getElementById("dot"),
    statusText: document.getElementById("statusText"),
    count: document.getElementById("count"),
    charCount: document.getElementById("charCount"),
    micBtn: document.getElementById("micBtn"),
    langTag: document.getElementById("langTag"),
    langMenu: document.getElementById("langMenu"),
    variantTag: document.getElementById("variantTag"),
    variantMenu: document.getElementById("variantMenu"),
    themeBtn: document.getElementById("themeBtn"),
    themeMenu: document.getElementById("themeMenu"),
    themeColorMeta: document.getElementById("themeColorMeta"),
    themeEditor: document.getElementById("themeEditor"),
    themeEditorForm: document.getElementById("themeEditorForm"),
    themeEditorTitle: document.getElementById("themeEditorTitle"),
    themeEditorClose: document.getElementById("themeEditorClose"),
    themeEditorSave: document.getElementById("themeEditorSave"),
    fullscreenBtn: document.getElementById("fullscreenBtn"),
    topbarToggle: document.getElementById("topbarToggle"),
    actions: document.getElementById("actions"),
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

  // --- Íconos (Lucide, inline — ver js/icons.js) ---
  // Se insertan una sola vez al arrancar: no cambian entre idiomas ni
  // temas (heredan el color vía currentColor). Los botones son
  // solo-ícono: el texto de cada uno vive en title/aria-label, no
  // visible en pantalla — ver setTitle().
  const BUTTON_ICONS = {
    docsBtn: "files",
    helpBtn: "command",
    copyBtn: "copy",
    readBtn: "play",
    exportBtn: "download",
    langTag: "languages",
    variantTag: "map-pin",
    themeBtn: "palette",
    fullscreenBtn: "maximize",
    micBtn: "mic",
    docsNew: "plus",
    helpClose: "x",
    docsClose: "x",
    themeEditorClose: "x",
    toastClose: "x",
    topbarToggle: "chevron-down",
    editToolbarToggle: "type",
    fmtBold: "bold",
    fmtItalic: "italic",
    fmtStrike: "strikethrough",
    fmtUnderline: "underline",
    alignLeftBtn: "align-left",
    alignCenterBtn: "align-center",
    alignRightBtn: "align-right",
    alignJustifyBtn: "align-justify",
    toolbarUndoBtn: "undo-2",
    toolbarRedoBtn: "redo-2",
  };
  for (const [key, icon] of Object.entries(BUTTON_ICONS)) {
    prependIcon(els[key], icon);
  }

  function setTitle(btn, text) {
    // data-tip, no title: el tooltip nativo del navegador no se puede
    // customizar (fuente/color/fondo del sistema, sin seguir el tema
    // activo) — ver [data-tip] en main.css, que dibuja uno propio.
    btn.dataset.tip = text;
    btn.setAttribute("aria-label", text);
    // Los botones son solo-ícono en el encabezado normal, pero en el
    // acordeón de pantallas chicas (.actions.is-open bajo 720px) se
    // muestra este mismo texto al lado del ícono (ver .action::after
    // en el CSS) — sin esto, ahí también quedarían solo íconos.
    btn.dataset.label = text;
  }
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  // Reemplaza el ícono de un botón por otro (ej. play↔pause,
  // maximize↔minimize) según cambia su estado.
  function swapIcon(btn, name) {
    btn.querySelector(".icon")?.replaceWith(
      document.createRange().createContextualFragment(iconMarkup(name))
    );
  }

  // --- Idioma activo: familia (léxico/interfaz) + variante regional
  // (solo cambia el código que recibe SpeechRecognition). Persistidos
  // por separado: la variante exacta ("bossa:lang") y, por familia,
  // la última variante elegida ("bossa:variants"), para que volver a
  // un idioma no resetee la región que ya habías elegido ahí. ---
  const familyKeys = Object.keys(config.families);
  const langStorage = new Storage({ key: "bossa:lang" });
  const variantStorage = new Storage({ key: "bossa:variants" });

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

  // Declarado temprano porque applyUiStrings() (más abajo) llama a
  // buildThemeMenu() antes de que se ejecute el resto de la sección
  // "Tema" que definiría esta constante donde se usa.
  const CUSTOMIZE_KEY = "__customize__";

  // Guarda el ESTADO de guardado (no el texto ya traducido), así
  // applyUiStrings() puede re-renderizarlo en el idioma nuevo sin
  // esperar al próximo cambio de guardado. Declarado temprano por lo
  // mismo que CUSTOMIZE_KEY: setSaveState() se llama durante el resto
  // de initApp(), antes de donde vivía esta declaración.
  let saveStateKind = "blank";

  // --- Documentos: varios en localStorage, uno abierto a la vez ---
  const docs = new DocStore();
  let currentDocId = docs.available ? docs.currentId() || docs.create("") : null;

  // --- Editor ---
  const editor = new Editor(els.editor, {
    scrollEl: els.sheet,
    overlayEl: els.editorOverlay,
    // Ver history.js: agrupa una ráfaga de tecleo continuo en un solo
    // escalón de deshacer, así Ctrl+Z no salta directo al último
    // comando de voz saltándose todo lo escrito a mano en el medio.
    onBeforeManualEdit: (text, caret) => history.snapshot(text, caret, { coalesce: true }),
    onChange: () => {
      els.count.textContent = String(editor.getWordCount());
      els.charCount.textContent = String(editor.getCharCount());
      if (docs.available && currentDocId) {
        setSaveState("saving");
        docs.saveDebounced(currentDocId, editor.getText(), () => setSaveState("saved"));
      }
      updateUndoRedoState();
    },
  });

  // --- Motor de comandos ---
  // Declarado ANTES de cargar el documento guardado (más abajo): si
  // hay texto guardado, editor.setText() dispara onChange() de forma
  // síncrona ya acá arriba (ver Editor#_render), y onChange() llama a
  // updateUndoRedoState(), que usa engine — moverlo después de cargar
  // el documento rompía con un ReferenceError de TDZ apenas alguien
  // tenía algo guardado (con la hoja vacía en pruebas nunca se
  // disparaba, por eso no se veía en desarrollo). Mismo patrón de bug
  // que CUSTOMIZE_KEY/saveStateKind antes en este archivo.
  const history = new History(editor);
  let parser = createParser(LEXICONS[family().lexicon]);
  const engine = new CommandEngine({
    editor,
    history,
    parser,
    onSwitchLanguage: (familyCode) => switchFamily(familyCode),
  });

  // Deshacer/rehacer en la barra de formato: mismo historial que
  // Ctrl+Z/Ctrl+Shift+Z y «deshacer»/«rehacer» por voz (history.js vía
  // engine). Se deshabilitan cuando no hay nada que deshacer/rehacer —
  // updateUndoRedoState() se llama en cada cambio de contenido y de
  // documento, no solo al hacer clic.
  function updateUndoRedoState() {
    els.toolbarUndoBtn.disabled = !engine.canUndo();
    els.toolbarRedoBtn.disabled = !engine.canRedo();
  }
  els.toolbarUndoBtn.addEventListener("click", () => {
    engine.undo();
    updateUndoRedoState();
    editor.focus();
  });
  els.toolbarRedoBtn.addEventListener("click", () => {
    engine.redo();
    updateUndoRedoState();
    editor.focus();
  });
  updateUndoRedoState();

  const savedText = docs.available ? docs.load(currentDocId) : "";
  if (savedText) editor.setText(savedText);
  setSaveState(docs.available ? (savedText ? "saved" : "blank") : "none");

  // --- Barra de formato: oculta por default, el usuario la despliega
  // con el ícono "type" del encabezado (editToolbarToggle, en
  // .actions). Cada botón inserta la misma marca que su comando de voz
  // equivalente (insertAtCaret con el texto tal cual) — ver
  // commands/lang/*.js (formatting/align), que usan las mismas marcas
  // universales **/*/~~/++ y [center]/[right]/[left]/[justify]. ---
  function updateToolbarToggleTitle() {
    const expanded = els.editToolbarToggle.getAttribute("aria-expanded") === "true";
    setTitle(els.editToolbarToggle, expanded ? t.editToolbarHide : t.editToolbarShow);
  }
  els.editToolbarToggle.addEventListener("click", () => {
    const expanded = els.editToolbarToggle.getAttribute("aria-expanded") === "true";
    els.editToolbarToggle.setAttribute("aria-expanded", String(!expanded));
    els.editToolbar.hidden = expanded;
    updateToolbarToggleTitle();
    editor.focus();
  });
  const INLINE_MARKS = {
    fmtBold: "**",
    fmtItalic: "*",
    fmtStrike: "~~",
    fmtUnderline: "++",
  };
  for (const [id, mark] of Object.entries(INLINE_MARKS)) {
    els[id].addEventListener("click", () => {
      editor.insertAtCaret(mark);
      editor.focus();
    });
  }
  // Alineado: reemplaza el marcador del párrafo (no insertAtCaret, ver
  // editor.js#setParagraphAlign) para que conviva bien con un estilo de
  // párrafo ya aplicado.
  const ALIGN_VALUES = {
    alignLeftBtn: "left",
    alignCenterBtn: "center",
    alignRightBtn: "right",
    alignJustifyBtn: "justify",
  };
  for (const [id, align] of Object.entries(ALIGN_VALUES)) {
    els[id].addEventListener("click", () => {
      editor.setParagraphAlign(align);
      editor.focus();
    });
  }
  els.styleSelect.addEventListener("change", () => {
    editor.setParagraphStyle(els.styleSelect.value || null);
    editor.focus();
  });

  // --- Panel de documentos ---
  function loadDocument(id) {
    currentDocId = id;
    docs.setCurrentId(id);
    editor.setText(docs.load(id));
    history.clear();
    engine.resetFormatState();
    setSaveState("saved");
    updateUndoRedoState();
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
    returnFocusTo: els.editor,
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
    returnFocusTo: els.editor,
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
    returnFocusTo: els.editor,
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

  // --- Leer en voz alta (SpeechSynthesis), con resaltado por palabra ---
  // Leemos el texto TAL CUAL está en el editor (no tidy()): los offsets
  // que manda el evento `boundary` son posiciones dentro del string que
  // le pasamos a speak(), y necesitamos que coincidan 1 a 1 con las
  // posiciones reales del <textarea> para poder seleccionar ahí mismo.
  const reader = new Reader({
    onState: (state) => {
      const readingNow = state === "reading";
      setTitle(els.readBtn, readingNow ? t.stop : t.read);
      els.readBtn.setAttribute("aria-pressed", String(readingNow));
      swapIcon(els.readBtn, readingNow ? "pause" : "play");
      els.micBtn.disabled = readingNow; // evita que el mic capte la lectura
      if (!readingNow) editor.clearSelection();
    },
    onBoundary: ({ charIndex, charLength }) => {
      if (charIndex == null) return;
      const text = editor.getText();
      const end = charLength
        ? charIndex + charLength
        : wordSpanAt(text, charIndex).end;
      editor.selectRange(charIndex, Math.min(end, text.length));
    },
  });
  els.readBtn.addEventListener("click", () => {
    if (reader.speaking) {
      reader.stop();
    } else {
      reader.speak(editor.getText(), variant().code);
    }
    editor.focus();
  });

  // --- Textos de interfaz (todo lo que no depende del léxico de comandos) ---
  function applyUiStrings() {
    document.title = t.title;
    els.langTag.dataset.tip = `${capitalize(t.langLabel)}: ${family().label}`;
    els.langTag.setAttribute("aria-label", t.langSwitchAria);
    els.langTag.dataset.label = els.langTag.dataset.tip;
    buildLangMenu();

    const v = variant();
    els.variantTag.dataset.tip = `${capitalize(t.variantLabel)}: ${v.label}`;
    els.variantTag.setAttribute("aria-label", t.variantSwitchAria);
    els.variantTag.dataset.label = els.variantTag.dataset.tip;
    els.variantTag.hidden = family().variants.length <= 1;
    buildVariantMenu();

    setTitle(els.themeBtn, themeLabel(currentTheme()));
    buildThemeMenu();
    setTitle(els.docsBtn, t.docs);
    setTitle(els.helpBtn, t.help);
    setTitle(els.copyBtn, t.copy);
    setTitle(els.readBtn, reader.speaking ? t.stop : t.read);
    setTitle(els.exportBtn, t.export);
    updateFullscreenBtn();
    els.editor.setAttribute("aria-label", t.editorAriaLabel);
    els.count.dataset.tip = t.wordsLabel;
    els.charCount.dataset.tip = t.charsLabel;
    els.toastClose.setAttribute("aria-label", t.toastCloseAria);
    els.toastClose.dataset.tip = t.toastCloseAria;
    updateToolbarToggleTitle();
    setTitle(els.fmtBold, t.editBold);
    setTitle(els.fmtItalic, t.editItalic);
    setTitle(els.fmtStrike, t.editStrike);
    setTitle(els.fmtUnderline, t.editUnderline);
    setTitle(els.alignLeftBtn, t.editAlignLeft);
    setTitle(els.alignCenterBtn, t.editAlignCenter);
    setTitle(els.alignRightBtn, t.editAlignRight);
    setTitle(els.alignJustifyBtn, t.editAlignJustify);
    setTitle(els.toolbarUndoBtn, t.editUndo);
    setTitle(els.toolbarRedoBtn, t.editRedo);
    // <select> no admite ::before/::after (elemento reemplazado): acá
    // sí se usa title nativo en vez de data-tip, es la única forma de
    // mostrar un tooltip sobre un <select> cerrado.
    els.styleSelect.title = t.editStyleLabel;
    els.styleSelect.setAttribute("aria-label", t.editStyleLabel);
    for (const [value, label] of Object.entries(t.editStyleOptions)) {
      const opt = els.styleSelect.querySelector(`option[value="${value}"]`);
      if (opt) opt.textContent = label;
    }
    renderSaveState();
  }
  applyUiStrings();

  function persistLanguage() {
    langStorage.save(variant().code);
    variantPrefs[familyKey] = variantIndex;
    variantStorage.save(JSON.stringify(variantPrefs));
  }

  // --- Selector de idioma: desplegable con todas las familias, igual
  // que "Exportar" (antes ciclaba es→en→fr→...→es con cada click). ---
  const langDropdown = createDropdown({ toggle: els.langTag, menu: els.langMenu, returnFocusTo: els.editor });
  function buildLangMenu() {
    renderMenuItems(
      els.langMenu,
      familyKeys.map((key) => ({
        key,
        label: config.families[key].label,
        title: config.families[key].labelEn,
      })),
      {
        isCurrent: (key) => key === familyKey,
        onSelect: (key) => {
          langDropdown.close();
          switchFamily(key);
        },
      }
    );
  }

  // --- Selector de variante regional: desplegable con las variantes
  // de la familia activa (se reconstruye al cambiar de idioma). ---
  const variantDropdown = createDropdown({ toggle: els.variantTag, menu: els.variantMenu, returnFocusTo: els.editor });
  function buildVariantMenu() {
    renderMenuItems(
      els.variantMenu,
      family().variants.map((v, i) => ({ key: String(i), label: v.label, title: v.labelEn })),
      {
        isCurrent: (key) => Number(key) === variantIndex,
        onSelect: (key) => {
          variantDropdown.close();
          variantIndex = Number(key);
          applyUiStrings();
          speech.setLang(variant().code);
          persistLanguage();
        },
      }
    );
  }

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
    setTitle(els.micBtn, listening ? t.stop : t.dictate);
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

  function setSaveState(kind) {
    saveStateKind = kind;
    renderSaveState();
  }
  function renderSaveState() {
    const text =
      { saving: t.savingState, saved: t.savedState, none: t.noSaveState, blank: "" }[
        saveStateKind
      ] ?? "";
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
  els.toastClose.addEventListener("click", () => {
    hideToast();
    editor.focus();
  });

  // --- Tema: desplegable con todos los temas, igual que "Exportar"
  // (antes ciclaba con cada click). Al final del menú siempre hay una
  // opción "Personalizar…" que abre el editor de colores (themeEditor.js)
  // en vez de aplicar un tema directamente. ---
  function applyThemeColorMeta() {
    els.themeColorMeta.content = themes[currentTheme()].colors.paper;
  }
  applyThemeColorMeta();
  const themeDropdown = createDropdown({ toggle: els.themeBtn, menu: els.themeMenu, returnFocusTo: els.editor });
  function buildThemeMenu() {
    const items = Object.keys(themes).map((id) => ({ key: id, label: themes[id].label }));
    items.push({ key: CUSTOMIZE_KEY, label: t.themeCustomize });
    renderMenuItems(els.themeMenu, items, {
      isCurrent: (key) => key === currentTheme(),
      onSelect: (key) => {
        themeDropdown.close();
        if (key === CUSTOMIZE_KEY) {
          themeEditor.open();
          return;
        }
        setTheme(key);
        setTitle(els.themeBtn, themeLabel(currentTheme()));
        applyThemeColorMeta();
        buildThemeMenu();
      },
    });
  }

  // --- Editor de tema personalizado: precarga los colores editables
  // del tema activo (o los ya guardados como "Personalizado", si el
  // tema activo ES el personalizado) y, al guardar, lo aplica y lo deja
  // guardado para la próxima sesión. ---
  const themeEditor = createThemeEditor({
    getT: () => t,
    returnFocusTo: els.editor,
    els: {
      overlay: els.themeEditor,
      form: els.themeEditorForm,
      title: els.themeEditorTitle,
      closeBtn: els.themeEditorClose,
      saveBtn: els.themeEditorSave,
    },
    getPrefillColors: () => {
      const c = themes[currentTheme()].colors;
      return {
        paper: c.paper,
        canvas: c.canvas,
        ink: c.ink,
        accent: c.accent,
        mic: c.mic || c.accent,
        danger: c.danger,
      };
    },
    onSave: (picks) => {
      applyCustomTheme(picks);
      setTitle(els.themeBtn, themeLabel(currentTheme()));
      applyThemeColorMeta();
      buildThemeMenu();
    },
  });
  buildThemeMenu();

  // --- Acordeón de acciones (pantallas chicas) ---
  els.topbarToggle.addEventListener("click", () => {
    const open = els.actions.classList.toggle("is-open");
    els.topbarToggle.setAttribute("aria-expanded", String(open));
    if (!open) editor.focus();
  });

  // --- Pantalla completa ---
  function isFullscreen() {
    return Boolean(document.fullscreenElement);
  }
  function updateFullscreenBtn() {
    const full = isFullscreen();
    setTitle(els.fullscreenBtn, full ? t.exitFullscreen : t.fullscreen);
    swapIcon(els.fullscreenBtn, full ? "minimize" : "maximize");
    editor.focus();
  }
  els.fullscreenBtn.addEventListener("click", () => {
    if (isFullscreen()) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  });
  // Sincroniza el botón si el usuario sale con Esc/F11 en vez de acá.
  document.addEventListener("fullscreenchange", updateFullscreenBtn);

  // --- Micrófono ---
  els.micBtn.addEventListener("click", () => {
    hideToast();
    speech.toggle();
    editor.focus();
  });

  // --- Copiar / Exportar (con limpieza de espaciado) ---
  els.copyBtn.addEventListener("click", async () => {
    const ok = await copyText(tidy(editor.getText()));
    showToast(ok ? t.copied : t.copyFailed);
    editor.focus();
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
        updateUndoRedoState();
      }
    } else if (ctrl && (key === "y" || (key === "z" && e.shiftKey))) {
      if (engine.canRedo()) {
        e.preventDefault();
        engine.redo();
        updateUndoRedoState();
      }
    }
  });

  setStatus("idle");
  els.count.textContent = String(editor.getWordCount());
  els.charCount.textContent = String(editor.getCharCount());
}
