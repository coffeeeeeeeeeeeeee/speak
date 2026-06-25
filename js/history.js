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

  snapshot(text) {
    this.undoStack.push(text);
    if (this.undoStack.length > this.limit) this.undoStack.shift();
    this.redoStack.length = 0; // una nueva acción invalida el rehacer
  }

  undo() {
    if (!this.undoStack.length) return false;
    this.redoStack.push(this.editor.getText());
    this.editor.setText(this.undoStack.pop());
    return true;
  }

  redo() {
    if (!this.redoStack.length) return false;
    this.undoStack.push(this.editor.getText());
    this.editor.setText(this.redoStack.pop());
    return true;
  }

  canUndo() {
    return this.undoStack.length > 0;
  }
  canRedo() {
    return this.redoStack.length > 0;
  }
}
