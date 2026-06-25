// ============================================================
// commands/engine.js
// Motor de comandos: toma el transcript final, lo pasa por el parser
// y aplica cada token al editor, gestionando mayúsculas e historial.
//
// Reglas de mayúsculas:
//   - automática tras . ! ? y saltos de línea (y al empezar la hoja),
//   - "mayúscula" / "minúscula": fuerzan la SIGUIENTE palabra,
//   - "todo mayúsculas" / "fin mayúsculas": modo sostenido.
// Cada mutación de contenido toma un snapshot para deshacer/rehacer.
// ============================================================

import * as ops from "../text-ops.js";

export class CommandEngine {
  constructor({ editor, history, parser }) {
    this.editor = editor;
    this.history = history;
    this.parser = parser;

    this.forceUpper = false; // modo "todo mayúsculas"
    this.capNext = false; // "mayúscula" puntual
    this.lowerNext = false; // "minúscula" puntual
  }

  /** Procesa un resultado final del reconocimiento. */
  process(transcript) {
    const tokens = this.parser.parse(transcript);
    for (const t of tokens) {
      if (t.type === "text") {
        this._snapshot();
        this._insertText(t.value);
      } else if (t.type === "insert") {
        this._snapshot();
        this.editor.insertAtCaret(t.value);
      } else if (t.type === "command") {
        this._runCommand(t.action);
      }
    }
  }

  _snapshot() {
    this.history.snapshot(this.editor.getText());
  }

  _insertText(text) {
    if (!text) return;
    let out = text;
    if (this.forceUpper) {
      out = out.toUpperCase();
    } else if (this.lowerNext) {
      out = ops.lowercaseFirst(out);
      this.lowerNext = false;
    } else if (this.capNext || ops.endsSentence(this.editor.getContextBefore())) {
      out = ops.capitalizeFirst(out);
    } else {
      // El reconocedor a veces capitaliza el inicio de cada segmento por su
      // cuenta (sobre todo tras reiniciarse en una pausa). Si no estamos en
      // inicio de oración, corregimos esa mayúscula espuria. Para forzar una
      // mayúscula a propósito (un nombre propio) está el comando "mayúscula".
      out = ops.lowercaseFirst(out);
    }
    this.capNext = false;
    this.editor.insertAtCaret(out);
  }

  _runCommand(action) {
    switch (action) {
      case "deleteWord":
        this._snapshot();
        this.editor.deleteWord();
        break;
      case "deleteSentence":
        this._snapshot();
        this.editor.deleteSentence();
        break;
      case "deleteAll":
        this._snapshot();
        this.editor.clear();
        break;
      case "selectAll":
        this.editor.selectAll();
        break;
      case "capitalizeNext":
        this.capNext = true;
        break;
      case "lowercaseNext":
        this.lowerNext = true;
        break;
      case "upperOn":
        this.forceUpper = true;
        break;
      case "upperOff":
        this.forceUpper = false;
        break;
      case "undo":
        this.history.undo();
        break;
      case "redo":
        this.history.redo();
        break;
    }
  }

  // Atajos de teclado.
  undo() {
    return this.history.undo();
  }
  redo() {
    return this.history.redo();
  }
  canUndo() {
    return this.history.canUndo();
  }
  canRedo() {
    return this.history.canRedo();
  }
}
