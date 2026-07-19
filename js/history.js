// ============================================================
// history.js
// Historial de deshacer/rehacer por snapshots del texto.
//
// `snapshot(text)` guarda el estado ANTES de una mutación, así
// deshacer restaura a ese estado previo. Es la red de seguridad de
// la detección automática: si un comando se dispara sin querer,
// "deshacer" (o Ctrl+Z) lo revierte al instante.
//
// `{ coalesce: true }` (edición manual con teclado) agrupa una ráfaga
// de tecleo continuo en un solo escalón de deshacer, en vez de uno
// por tecla — así Ctrl+Z deshace "lo último que escribiste", no un
// carácter a la vez ni todo lo tipeado desde el último comando de voz.
// Los comandos de voz (coalesce: false, el default) siempre son un
// escalón propio.
// ============================================================

const COALESCE_WINDOW_MS = 700;

export class History {
  constructor(editor, limit = 300) {
    this.editor = editor;
    this.limit = limit;
    this.undoStack = [];
    this.redoStack = [];
    this._lastCoalesce = false;
    this._lastAt = 0;
  }

  snapshot(text, caret, { coalesce = false } = {}) {
    const now = Date.now();
    const withinBurst =
      coalesce &&
      this._lastCoalesce &&
      this.undoStack.length > 0 &&
      now - this._lastAt < COALESCE_WINDOW_MS;

    if (!withinBurst) {
      this.undoStack.push({ text, caret });
      if (this.undoStack.length > this.limit) this.undoStack.shift();
      this.redoStack.length = 0; // una nueva acción invalida el rehacer
    }
    this._lastCoalesce = coalesce;
    this._lastAt = now;
  }

  undo() {
    if (!this.undoStack.length) return false;
    this.redoStack.push({ text: this.editor.getText(), caret: this.editor.getCaret() });
    const prev = this.undoStack.pop();
    this.editor.setText(prev.text, prev.caret);
    this._lastCoalesce = false; // que la próxima tecla arranque una ráfaga nueva
    return true;
  }

  redo() {
    if (!this.redoStack.length) return false;
    this.undoStack.push({ text: this.editor.getText(), caret: this.editor.getCaret() });
    const next = this.redoStack.pop();
    this.editor.setText(next.text, next.caret);
    this._lastCoalesce = false;
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
