// ============================================================
// themeEditor.js
// Panel para armar el tema "Personalizado": seis selectores de color
// (hoja/fondo/texto/acento/dictar/alerta) — el resto de las variables
// (ink-soft/ghost/line/accent-dim) se derivan solas, ver
// customTheme.js. Mismo patrón de apertura/cierre accesible que
// help.js/docsPanel.js.
// ============================================================

import { EDITABLE_KEYS } from "./customTheme.js";

export function createThemeEditor({ getT, els, getPrefillColors, onSave }) {
  let lastFocus = null;

  function build() {
    const t = getT();
    els.title.textContent = t.themeEditorTitle;
    els.closeBtn.setAttribute("aria-label", t.themeEditorCloseAria);
    els.saveBtn.textContent = t.themeEditorSave;
    for (const key of EDITABLE_KEYS) {
      const label = els.form.querySelector(`[data-color-label="${key}"]`);
      if (label) label.textContent = t.themeColorLabels[key];
    }
  }

  function prefill() {
    const colors = getPrefillColors();
    for (const key of EDITABLE_KEYS) {
      const input = els.form.querySelector(`[data-color-input="${key}"]`);
      if (input) input.value = colors[key];
    }
  }

  function open() {
    build();
    prefill();
    lastFocus = document.activeElement;
    els.overlay.hidden = false;
    els.closeBtn.focus();
    document.addEventListener("keydown", onKeydown, true);
  }

  function close() {
    els.overlay.hidden = true;
    document.removeEventListener("keydown", onKeydown, true);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function isOpen() {
    return !els.overlay.hidden;
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  function readForm() {
    const picks = {};
    for (const key of EDITABLE_KEYS) {
      picks[key] = els.form.querySelector(`[data-color-input="${key}"]`).value;
    }
    return picks;
  }

  function wire() {
    els.closeBtn.addEventListener("click", close);
    els.overlay.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-close")) close();
    });
    els.form.addEventListener("submit", (e) => {
      e.preventDefault();
      onSave(readForm());
      close();
    });
  }
  wire();

  return { open, close, isOpen, build };
}
