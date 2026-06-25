// ============================================================
// editor.js
// Envoltura DOM de la hoja (<textarea>, texto plano).
//
// Mantiene `committed` (confirmado) e `interim` (lo que se está
// reconociendo) por separado: la textarea muestra committed + interim
// para que las palabras aparezcan vivas, y el interino se reemplaza
// en su lugar al confirmarse. La lógica de strings vive en text-ops.js;
// acá solo se renderiza, se mueve el caret y se hace scroll.
// El motor de comandos (engine.js) orquesta usando estos métodos.
// ============================================================

import * as ops from "./text-ops.js";

export class Editor {
  /**
   * @param {HTMLTextAreaElement} textarea
   * @param {Object} [opts]
   * @param {()=>void} [opts.onChange]
   * @param {HTMLElement} [opts.scrollEl]
   */
  constructor(textarea, opts = {}) {
    this.el = textarea;
    this.onChange = opts.onChange || (() => {});
    this.scrollEl = opts.scrollEl || null;

    this.committed = "";
    this.interim = "";
    this._programmatic = false;

    // Edición manual con teclado: sincronizamos `committed`.
    this.el.addEventListener("input", () => {
      if (this._programmatic) return;
      if (this.interim) return; // evitamos hornear texto provisional
      this.committed = this.el.value;
      this._autoGrow();
      this.onChange();
    });
  }

  // --- Render interno ---
  _render(keepCaretAtEnd) {
    const value = this.interim
      ? this.committed + ops.joiner(this.committed, this.interim) + this.interim
      : this.committed;

    this._programmatic = true;
    this.el.value = value;
    this._programmatic = false;

    if (keepCaretAtEnd) {
      const end = value.length;
      this.el.setSelectionRange(end, end);
    }
    this._autoGrow();
    this.onChange();
  }

  _autoGrow() {
    this.el.style.height = "auto";
    this.el.style.height = this.el.scrollHeight + "px";
  }

  _scrollToCaret() {
    if (this.scrollEl) this.scrollEl.scrollTop = this.scrollEl.scrollHeight;
  }

  // --- API que usa el motor ---

  setInterim(text) {
    this.interim = (text || "").trim();
    this._render(true);
    if (this.interim) this._scrollToCaret();
  }

  append(text) {
    if (!text) return;
    this.committed = ops.appendText(this.committed, text);
    this.interim = "";
    this._render(true);
    this._scrollToCaret();
  }

  deleteLastWord() {
    this.committed = ops.deleteLastWord(this.committed);
    this.interim = "";
    this._render(true);
  }

  deleteLastSentence() {
    this.committed = ops.deleteLastSentence(this.committed);
    this.interim = "";
    this._render(true);
  }

  clear() {
    this.committed = "";
    this.interim = "";
    this._render(true);
  }

  selectAll() {
    this.el.focus();
    this.el.select();
  }

  getText() {
    return this.committed;
  }

  setText(text) {
    this.committed = text || "";
    this.interim = "";
    this._render(true);
  }

  getWordCount() {
    const t = this.committed.trim();
    return t ? t.split(/\s+/).length : 0;
  }

  focus() {
    this.el.focus();
  }
}
