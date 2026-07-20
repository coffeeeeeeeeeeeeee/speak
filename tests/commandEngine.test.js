import { test, assertEqual } from "./tiny-test.js";
import { createParser } from "../js/commands/parser.js";
import { es } from "../js/commands/lang/es.js";
import { CommandEngine } from "../js/commands/engine.js";
import { History } from "../js/history.js";
import { Editor } from "../js/editor.js";

const parser = createParser(es);

function makeEngine(text, caret) {
  const textarea = document.createElement("textarea");
  document.body.appendChild(textarea);
  const editor = new Editor(textarea);
  editor.setText(text, caret);
  const history = new History(editor);
  const engine = new CommandEngine({ editor, history, parser });
  return { editor, engine };
}

// --- parser: produce tokens "align"/"style" separados de "insert" ---

test("parser: los comandos de alineado producen tokens type=align con la palabra clave", () => {
  assertEqual(parser.parse("centrar"), [{ type: "align", value: "center" }]);
  assertEqual(parser.parse("justificar"), [{ type: "align", value: "justify" }]);
});

test("parser: los comandos de estilo producen tokens type=style con la palabra clave", () => {
  assertEqual(parser.parse("título uno"), [{ type: "style", value: "h1" }]);
  assertEqual(parser.parse("cita"), [{ type: "style", value: "quote" }]);
  assertEqual(parser.parse("texto normal"), [{ type: "style", value: "" }]);
});

// --- engine: aplica alineado/estilo por voz reemplazando, no insertando ---

test("engine: «centrar» aplica el marcador de alineado al párrafo del cursor", () => {
  const { editor, engine } = makeEngine("Hola mundo", 3);
  engine.process("centrar");
  assertEqual(editor.getText(), "[center]Hola mundo");
});

test("engine: «cita» aplica el marcador de estilo al párrafo del cursor", () => {
  const { editor, engine } = makeEngine("Hola mundo", 3);
  engine.process("cita");
  assertEqual(editor.getText(), "[quote]Hola mundo");
});

// Antes de esto la voz insertaba el marcador de alineado con
// insertAtCaret (como los botones viejos de la barra), y el separador
// automático entre inserciones metía un espacio entre "[estilo]" y
// "[alineado]" que rompía el reconocimiento del segundo marcador. Ver
// editor.js#setParagraphAlign.
test("engine: «centrar» dicho sobre un párrafo con estilo no rompe el marcador (sin espacio)", () => {
  const { editor, engine } = makeEngine("[quote]Hola mundo", 10);
  engine.process("centrar");
  assertEqual(editor.getText(), "[quote][center]Hola mundo");
});

test("engine: «cita» dicho sobre un párrafo ya alineado preserva el alineado", () => {
  const { editor, engine } = makeEngine("[center]Hola mundo", 10);
  engine.process("cita");
  assertEqual(editor.getText(), "[quote][center]Hola mundo");
});

test("engine: un segundo comando de alineado reemplaza al anterior, no lo apila", () => {
  const { editor, engine } = makeEngine("[center]Hola mundo", 10);
  engine.process("alinear a la derecha");
  assertEqual(editor.getText(), "[right]Hola mundo");
});

test("engine: «texto normal» quita el estilo y conserva el alineado", () => {
  const { editor, engine } = makeEngine("[quote][center]Hola mundo", 15);
  engine.process("texto normal");
  assertEqual(editor.getText(), "[center]Hola mundo");
});
