// ============================================================
// editor.js
// Envoltura DOM de la hoja (<textarea>, texto plano), consciente del
// CURSOR: el dictado y los comandos insertan/borran en la posición del
// cursor (no siempre al final). El interino se muestra en esa posición
// y se reemplaza al confirmarse.
//
// La pantalla solo se desplaza lo mínimo para mantener el cursor a la
// vista (sin saltar al fondo), lo que evita el "sube y baja".
// ============================================================

import * as ops from "./text-ops.js";

export class Editor {
  constructor(textarea, opts = {}) {
    this.el = textarea;
    this.onChange = opts.onChange || (() => {});
    this.scrollEl = opts.scrollEl || null;

    this.text = "";     // texto confirmado
    this.caret = 0;     // posición de inserción dentro de `text`
    this.interim = "";  // texto provisional (en el cursor)
    this._programmatic = false;
    this._mirror = null;

    // Edición manual con teclado.
    this.el.addEventListener("input", () => {
      if (this._programmatic || this.interim) return;
      this.text = this.el.value;
      this.caret = this.el.selectionStart;
      this._autoGrow();
      this.onChange();
    });

    // Reposicionar el punto de dictado al hacer clic o navegar con teclas.
    const sync = () => {
      if (this._programmatic || this.interim) return;
      this.caret = this.el.selectionStart;
    };
    this.el.addEventListener("click", sync);
    this.el.addEventListener("keyup", sync);
  }

  // --- Render ---
  _value() {
    return this.interim
      ? this.text.slice(0, this.caret) + this.interim + this.text.slice(this.caret)
      : this.text;
  }

  _render({ ensureVisible = true } = {}) {
    const value = this._value();
    const pos = this.caret + this.interim.length;

    this._programmatic = true;
    this.el.value = value;
    // Fijar el cursor explícitamente: si no, asignar value lo manda al final.
    this.el.setSelectionRange(pos, pos);
    this._programmatic = false;

    this._autoGrow();
    if (ensureVisible) this._ensureCaretVisible();
    this.onChange();
  }

  _autoGrow() {
    this.el.style.height = "auto";
    this.el.style.height = this.el.scrollHeight + "px";
  }

  // Desplaza el contenedor SOLO si el cursor quedó fuera de la vista.
  _ensureCaretVisible() {
    if (!this.scrollEl) return;
    try {
      const cy = this._caretClientY();
      if (cy == null) return;
      const r = this.scrollEl.getBoundingClientRect();
      const margin = 56;
      if (cy < r.top + margin) {
        this.scrollEl.scrollTop -= r.top + margin - cy;
      } else if (cy > r.bottom - margin) {
        this.scrollEl.scrollTop += cy - (r.bottom - margin);
      }
    } catch (_) {
      /* si la medición falla, no desplazamos */
    }
  }

  // Mide la coordenada Y (viewport) del cursor con un espejo del textarea.
  _caretClientY() {
    const el = this.el;
    const cs = getComputedStyle(el);
    const div = this._mirror || (this._mirror = document.createElement("div"));
    const copy = [
      "boxSizing", "width", "paddingTop", "paddingRight", "paddingBottom",
      "paddingLeft", "borderTopWidth", "borderRightWidth", "borderBottomWidth",
      "borderLeftWidth", "fontFamily", "fontSize", "fontWeight", "fontStyle",
      "letterSpacing", "lineHeight", "textTransform", "wordSpacing", "tabSize",
    ];
    for (const p of copy) div.style[p] = cs[p];
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.overflowWrap = "break-word";
    div.style.pointerEvents = "none";

    const pos = this.caret + this.interim.length;
    div.textContent = this._value().slice(0, pos);
    const marker = document.createElement("span");
    marker.textContent = "\u200b";
    div.appendChild(marker);

    document.body.appendChild(div);
    const elRect = el.getBoundingClientRect();
    div.style.left = elRect.left + window.scrollX + "px";
    div.style.top = elRect.top + window.scrollY + "px";
    const y = marker.getBoundingClientRect().top;
    document.body.removeChild(div);
    div.textContent = "";

    return y + parseFloat(cs.lineHeight || cs.fontSize) / 2;
  }

  // --- API que usa el motor ---

  setInterim(s) {
    this.interim = (s || "").trim();
    this._render();
  }

  insertAtCaret(s) {
    const r = ops.insertAt(this.text, this.caret, s);
    this.text = r.text;
    this.caret = r.caret;
    this.interim = "";
    this._render();
  }

  deleteWord() {
    const r = ops.deleteWordBefore(this.text, this.caret);
    this.text = r.text;
    this.caret = r.caret;
    this.interim = "";
    this._render();
  }

  deleteSentence() {
    const r = ops.deleteSentenceBefore(this.text, this.caret);
    this.text = r.text;
    this.caret = r.caret;
    this.interim = "";
    this._render();
  }

  clear() {
    this.text = "";
    this.caret = 0;
    this.interim = "";
    this._render();
  }

  selectAll() {
    this.el.focus();
    this.el.select();
  }

  getText() {
    return this.text;
  }

  getContextBefore() {
    return this.text.slice(0, this.caret);
  }

  getCaret() {
    return this.caret;
  }

  // `caret` es opcional: si se omite (carga inicial, "borra todo"), el
  // cursor va al final. Deshacer/rehacer sí lo pasan para no perder el
  // punto de edición.
  setText(text, caret) {
    this.text = text || "";
    this.caret = caret == null ? this.text.length : Math.max(0, Math.min(caret, this.text.length));
    this.interim = "";
    this._render();
  }

  getWordCount() {
    const t = this.text.trim();
    return t ? t.split(/\s+/).length : 0;
  }

  focus() {
    this.el.focus();
  }
}
