// ============================================================
// themeEditor.js
// Panel para armar el tema "Personalizado": seis selectores de color
// (hoja/fondo/texto/acento/dictar/alerta) — el resto de las variables
// (ink-soft/ghost/line/accent-dim) se derivan solas, ver
// customTheme.js. Mismo patrón de apertura/cierre accesible que
// help.js/docsPanel.js.
// ============================================================

import { EDITABLE_KEYS } from "./customTheme.js";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

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
      const hex = els.form.querySelector(`[data-color-hex="${key}"]`);
      if (input) input.value = colors[key];
      if (hex) hex.value = colors[key].toUpperCase();
    }
  }

  // El swatch nativo (<input type="color">) abre el selector del
  // sistema, que en Linux/GTK suele arrancar en sliders RGB en vez de
  // hex — así que el valor "de verdad" es el campo de texto de al
  // lado, sincronizado en los dos sentidos con el swatch (ver
  // main.css). Se conecta una sola vez acá, no en cada open()/prefill().
  function wireHexSync() {
    for (const key of EDITABLE_KEYS) {
      const input = els.form.querySelector(`[data-color-input="${key}"]`);
      const hex = els.form.querySelector(`[data-color-hex="${key}"]`);
      if (!input || !hex) continue;
      input.addEventListener("input", () => {
        hex.value = input.value.toUpperCase();
      });
      hex.addEventListener("input", () => {
        if (HEX_RE.test(hex.value)) input.value = hex.value;
      });
      // Al salir del campo, si quedó algo inválido (o a medio escribir),
      // volvemos a mostrar el último valor válido en vez de dejarlo así.
      hex.addEventListener("blur", () => {
        hex.value = input.value.toUpperCase();
      });
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
    wireHexSync();
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
