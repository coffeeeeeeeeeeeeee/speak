import { test, assertEqual } from "./tiny-test.js";
import { createParser } from "../js/commands/parser.js";
import { es } from "../js/commands/lang/es.js";

const parser = createParser(es);

test("parser: texto sin comandos pasa entero como un solo token", () => {
  assertEqual(parser.parse("hola mundo bonito"), [
    { type: "text", value: "hola mundo bonito" },
  ]);
});

test("parser: detecta puntuación en medio del dictado", () => {
  assertEqual(parser.parse("hola punto mundo"), [
    { type: "text", value: "hola" },
    { type: "insert", value: "." },
    { type: "text", value: "mundo" },
  ]);
});

test("parser: match codicioso prioriza la frase más larga", () => {
  assertEqual(parser.parse("chau punto y aparte adios"), [
    { type: "text", value: "chau" },
    { type: "insert", value: ".\n\n" },
    { type: "text", value: "adios" },
  ]);
});

test("parser: si la frase larga no matchea, cae a la más corta (no se come palabras)", () => {
  // "punto y" no es una frase del léxico (sí "punto y aparte" / "punto y seguido"),
  // así que debe matchear solo "punto" y dejar "y" como texto suelto.
  assertEqual(parser.parse("punto y"), [
    { type: "insert", value: "." },
    { type: "text", value: "y" },
  ]);
});

test("parser: match insensible a mayúsculas y tildes", () => {
  assertEqual(parser.parse("Punto"), [{ type: "insert", value: "." }]);
});

test("parser: el texto libre conserva tildes y mayúsculas originales", () => {
  assertEqual(parser.parse("Cómo estás"), [
    { type: "text", value: "Cómo estás" },
  ]);
});

test("parser: comando de edición de dos palabras", () => {
  assertEqual(parser.parse("hola borra palabra"), [
    { type: "text", value: "hola" },
    { type: "command", action: "deleteWord" },
  ]);
});

test("parser: comandos de mayúsculas e historial", () => {
  assertEqual(parser.parse("mayúscula"), [
    { type: "command", action: "capitalizeNext" },
  ]);
  assertEqual(parser.parse("deshacer"), [{ type: "command", action: "undo" }]);
});

test("parser: «literal <palabra>» inserta la palabra tal cual, no el comando", () => {
  assertEqual(parser.parse("literal punto"), [
    { type: "text", value: "punto" },
  ]);
});

test("parser: «literal» sin palabra siguiente se inserta a sí mismo", () => {
  assertEqual(parser.parse("hola literal"), [
    { type: "text", value: "hola literal" },
  ]);
});

test("parser: «literal» preserva mayúsculas de la palabra escapada", () => {
  assertEqual(parser.parse("literal Punto"), [
    { type: "text", value: "Punto" },
  ]);
});

test("parser: transcript vacío no produce tokens", () => {
  assertEqual(parser.parse(""), []);
});

test("parser: secuencia con texto, comando de formato, puntuación y comando de edición", () => {
  assertEqual(
    parser.parse("hola mayúscula mundo punto nueva línea chau borra palabra"),
    [
      { type: "text", value: "hola" },
      { type: "command", action: "capitalizeNext" },
      { type: "text", value: "mundo" },
      { type: "insert", value: "." },
      { type: "insert", value: "\n" },
      { type: "text", value: "chau" },
      { type: "command", action: "deleteWord" },
    ]
  );
});

test("parser: «cambiar a <idioma>» produce un token de idioma con la clave de familia", () => {
  assertEqual(parser.parse("cambiar a inglés"), [
    { type: "language", value: "en" },
  ]);
});
