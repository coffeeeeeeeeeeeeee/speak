import { test, assertEqual } from "./tiny-test.js";
import * as ops from "../js/text-ops.js";

// --- joiner ---

test("joiner: sin texto a un lado no agrega separador", () => {
  assertEqual(ops.joiner("", "hola"), "");
  assertEqual(ops.joiner("hola", ""), "");
});

test("joiner: entre dos palabras agrega un espacio", () => {
  assertEqual(ops.joiner("hola", "mundo"), " ");
});

test("joiner: no duplica espacio si ya hay uno de cualquier lado", () => {
  assertEqual(ops.joiner("hola ", "mundo"), "");
  assertEqual(ops.joiner("hola", " mundo"), "");
});

test("joiner: puntuación de cierre se pega sin espacio", () => {
  assertEqual(ops.joiner("hola", "."), "");
  assertEqual(ops.joiner("hola", ")"), "");
  assertEqual(ops.joiner("hola", "…"), "");
});

test("joiner: después de un signo de apertura no va espacio", () => {
  assertEqual(ops.joiner("hola ¿", "cómo"), "");
  assertEqual(ops.joiner("(", "mundo"), "");
});

// --- appendText ---

test("appendText: arranca un documento vacío sin espacio previo", () => {
  assertEqual(ops.appendText("", "Hola"), "Hola");
});

test("appendText: une con espacio", () => {
  assertEqual(ops.appendText("Hola", "mundo"), "Hola mundo");
});

test("appendText: con texto vacío no cambia nada", () => {
  assertEqual(ops.appendText("Hola", ""), "Hola");
});

// --- deleteLastWord ---

test("deleteLastWord: borra la última palabra", () => {
  assertEqual(ops.deleteLastWord("Hola mundo"), "Hola");
});

test("deleteLastWord: ignora espacios colgantes antes de borrar", () => {
  assertEqual(ops.deleteLastWord("Hola mundo   "), "Hola");
});

test("deleteLastWord: deja el string vacío si solo había una palabra", () => {
  assertEqual(ops.deleteLastWord("Hola"), "");
  assertEqual(ops.deleteLastWord(""), "");
});

test("deleteLastWord: la puntuación pegada a la palabra anterior queda intacta", () => {
  assertEqual(ops.deleteLastWord("Hola, mundo"), "Hola,");
});

// --- deleteLastSentence ---

test("deleteLastSentence: vuelve al final de la oración anterior", () => {
  assertEqual(ops.deleteLastSentence("Hola. Mundo bello."), "Hola.");
});

test("deleteLastSentence: sin oración previa, borra todo", () => {
  assertEqual(ops.deleteLastSentence("Mundo bello."), "");
});

test("deleteLastSentence: string vacío no rompe", () => {
  assertEqual(ops.deleteLastSentence(""), "");
});

test("deleteLastSentence: un salto de línea también cuenta como límite", () => {
  assertEqual(ops.deleteLastSentence("Primera línea\nSegunda línea."), "Primera línea\n");
});

// --- endsSentence ---

test("endsSentence: hoja vacía cuenta como inicio de oración", () => {
  assertEqual(ops.endsSentence(""), true);
});

test("endsSentence: tras un salto de línea", () => {
  assertEqual(ops.endsSentence("Hola\n"), true);
});

test("endsSentence: tras punto (con o sin espacio final)", () => {
  assertEqual(ops.endsSentence("Hola."), true);
  assertEqual(ops.endsSentence("Hola. "), true);
});

test("endsSentence: en medio de una palabra, no", () => {
  assertEqual(ops.endsSentence("Hola"), false);
});

test("endsSentence: solo signos de apertura cuenta como inicio", () => {
  assertEqual(ops.endsSentence("¿"), true);
  assertEqual(ops.endsSentence("  ¿"), true);
});

// --- capitalizeFirst / lowercaseFirst ---

test("capitalizeFirst: sube la primera letra", () => {
  assertEqual(ops.capitalizeFirst("hola"), "Hola");
});

test("capitalizeFirst: string vacío no rompe", () => {
  assertEqual(ops.capitalizeFirst(""), "");
});

test("lowercaseFirst: baja la primera letra", () => {
  assertEqual(ops.lowercaseFirst("Hola"), "hola");
});

test("lowercaseFirst: string vacío no rompe", () => {
  assertEqual(ops.lowercaseFirst(""), "");
});

// --- tidy ---

test("tidy: colapsa espacios múltiples", () => {
  assertEqual(ops.tidy("Hola   mundo"), "Hola mundo");
});

test("tidy: saca espacio antes de puntuación", () => {
  assertEqual(ops.tidy("Hola , mundo"), "Hola, mundo");
});

test("tidy: colapsa 3+ saltos de línea a 2", () => {
  assertEqual(ops.tidy("Hola\n\n\n\nMundo"), "Hola\n\nMundo");
});

test("tidy: recorta espacios al principio/final", () => {
  assertEqual(ops.tidy("  Hola  "), "Hola");
});

test("tidy: texto nulo no rompe", () => {
  assertEqual(ops.tidy(null), "");
});

// --- insertAt (caret) ---

test("insertAt: inserta en medio del texto con espacios correctos", () => {
  const r = ops.insertAt("Hola mundo", 4, "bello");
  assertEqual(r, { text: "Hola bello mundo", caret: 10 });
});

test("insertAt: inserta al final", () => {
  const r = ops.insertAt("Hola.", 5, "Mundo");
  assertEqual(r, { text: "Hola. Mundo", caret: 11 });
});

test("insertAt: string vacío no cambia texto ni caret", () => {
  const r = ops.insertAt("Hola", 4, "");
  assertEqual(r, { text: "Hola", caret: 4 });
});

// --- deleteWordBefore / deleteSentenceBefore (caret) ---

test("deleteWordBefore: borra la palabra a la izquierda del cursor, al final", () => {
  const r = ops.deleteWordBefore("Hola mundo", 10);
  assertEqual(r, { text: "Hola", caret: 4 });
});

test("deleteWordBefore: con el cursor en medio, preserva lo que sigue", () => {
  const r = ops.deleteWordBefore("Hola mundo bello", 10);
  assertEqual(r, { text: "Hola bello", caret: 4 });
});

test("deleteWordBefore: cursor pegado justo antes de la palabra siguiente no las une", () => {
  // Clic justo antes de "bello" (después del espacio) + «borra palabra»:
  // no debe comerse el espacio separador y pegar "Hola" con "bello".
  const r = ops.deleteWordBefore("Hola mundo bello", 11);
  assertEqual(r, { text: "Hola bello", caret: 4 });
});

test("deleteSentenceBefore: borra la oración a la izquierda del cursor", () => {
  const r = ops.deleteSentenceBefore("Hola. Mundo bello.", 18);
  assertEqual(r, { text: "Hola.", caret: 5 });
});

test("deleteSentenceBefore: cursor pegado al inicio de la oración siguiente no las une", () => {
  const r = ops.deleteSentenceBefore("Hola. Mundo bello. Chau.", 19);
  assertEqual(r, { text: "Hola. Chau.", caret: 5 });
});
