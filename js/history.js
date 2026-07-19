// ============================================================
// history.js
// Historial de deshacer/rehacer por snapshots del texto.
//
// `snapshot(text)` guarda el estado ANTES de una mutación, así
// deshacer restaura a ese estado previo. Es la red de seguridad de
// la detección automática: si un comando se dispara sin querer,
// "deshacer" (o Ctrl+Z) lo revierte al instante.
// ============================================================

export class History {
  constructor(editor, limit = 300) {
    this.editor = editor;
    this.limit = limit;
    this.undoStack = [];
    this.redoStack = [];
  }

  snapshot(text, caret) {
    this.undoStack.push({ text, caret });
    if (this.undoStack.length > this.limit) this.undoStack.shift();
    this.redoStack.length = 0; // una nueva acción invalida el rehacer
  }

  undo() {
    if (!this.undoStack.length) return false;
    this.redoStack.push({ text: this.editor.getText(), caret: this.editor.getCaret() });
    const prev = this.undoStack.pop();
    this.editor.setText(prev.text, prev.caret);
    return true;
  }

  redo() {
    if (!this.redoStack.length) return false;
    this.undoStack.push({ text: this.editor.getText(), caret: this.editor.getCaret() });
    const next = this.redoStack.pop();
    this.editor.setText(next.text, next.caret);
    return true;
  }

  canUndo() {
    return this.undoStack.length > 0;
  }
  canRedo() {
    return this.redoStack.length > 0;
  }

  /** El historial de deshacer es por documento: al cambiar de uno a
   * otro no tiene sentido arrastrar los cambios del anterior. */
  clear() {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
  }
}
