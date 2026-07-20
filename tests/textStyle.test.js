import { test, assertEqual, assertTrue } from "./tiny-test.js";
import { extractStyle } from "../js/textStyle.js";
import { toHtml } from "../js/export/html.js";
import { toRtf } from "../js/export/rtf.js";
import { toMarkdown } from "../js/export/markdown.js";
import { Editor } from "../js/editor.js";

// --- extractStyle ---

test("extractStyle: reconoce title/subtitle/h1-h4/quote al inicio", () => {
  assertEqual(extractStyle("[title]Hola").style, "title");
  assertEqual(extractStyle("[subtitle]Hola").style, "subtitle");
  assertEqual(extractStyle("[h1]Hola").style, "h1");
  assertEqual(extractStyle("[h2]Hola").style, "h2");
  assertEqual(extractStyle("[h3]Hola").style, "h3");
  assertEqual(extractStyle("[h4]Hola").style, "h4");
  assertEqual(extractStyle("[quote]Hola").style, "quote");
  assertEqual(extractStyle("[h1]Hola").body, "Hola");
});

test("extractStyle: sin marcador, style null y body sin tocar", () => {
  const r = extractStyle("Hola [h1] mundo");
  assertEqual(r.style, null);
  assertEqual(r.body, "Hola [h1] mundo");
});

test("extractStyle: no confunde un marcador de alineado con uno de estilo", () => {
  assertEqual(extractStyle("[center]Hola").style, null);
});

// --- html ---

test("toHtml: [title] se traduce a <h1> y no deja el marcador", () => {
  const html = toHtml("[title]Mi novela");
  assertTrue(html.includes("<h1>"), "usa h1");
  assertTrue(!html.includes("[title]"), "no deja el marcador visible");
  assertTrue(html.includes("Mi novela"), "conserva el texto");
});

test("toHtml: [h1]..[h4] bajan un nivel (h2..h5) para no chocar con el título", () => {
  assertTrue(toHtml("[h1]Cap. 1").includes("<h2>"));
  assertTrue(toHtml("[h2]Cap. 1").includes("<h3>"));
  assertTrue(toHtml("[h3]Cap. 1").includes("<h4>"));
  assertTrue(toHtml("[h4]Cap. 1").includes("<h5>"));
});

test("toHtml: [subtitle] es <p class=\"subtitle\">", () => {
  const html = toHtml("[subtitle]Una historia");
  assertTrue(html.includes('<p class="subtitle">'), "usa la clase subtitle");
});

test("toHtml: [quote] es <blockquote>", () => {
  const html = toHtml("[quote]Ser o no ser");
  assertTrue(html.includes("<blockquote>"), "usa blockquote");
  assertTrue(html.includes("</blockquote>"), "cierra blockquote");
});

test("toHtml: estilo + alineado combinados (orden canónico estilo, luego alineado)", () => {
  const html = toHtml("[h1][center]Título centrado");
  assertTrue(html.includes('<h2 style="text-align:center">'), "combina tag de estilo y align");
  assertTrue(!html.includes("[h1]") && !html.includes("[center]"), "no deja marcadores");
});

// --- rtf ---

test("toRtf: [title] agrega \\fs56\\b agrupado y saca el marcador", () => {
  const rtf = toRtf("[title]Mi novela");
  assertTrue(rtf.includes("{\\fs56\\b Mi novela}"), "envuelve con tamaño/negrita agrupados");
  assertTrue(!rtf.includes("[title]"), "no deja el marcador");
});

test("toRtf: [quote] agrega \\i agrupado", () => {
  const rtf = toRtf("[quote]Ser o no ser");
  assertTrue(rtf.includes("{\\i Ser o no ser}"), "envuelve en cursiva agrupada");
});

test("toRtf: párrafo sin estilo no agrega grupo extra", () => {
  const rtf = toRtf("Hola.");
  assertTrue(rtf.includes("\\pard\\ql Hola."), "sin grupo de estilo cuando no hay marcador");
});

// --- markdown ---

test("toMarkdown: [title]/[h1]-[h4] son encabezados MD reales (# .. #####)", () => {
  assertEqual(toMarkdown("[title]Hola").trim(), "# Hola");
  assertEqual(toMarkdown("[h1]Hola").trim(), "## Hola");
  assertEqual(toMarkdown("[h2]Hola").trim(), "### Hola");
  assertEqual(toMarkdown("[h3]Hola").trim(), "#### Hola");
  assertEqual(toMarkdown("[h4]Hola").trim(), "##### Hola");
});

test("toMarkdown: [subtitle] queda en cursiva, [quote] como blockquote MD", () => {
  assertEqual(toMarkdown("[subtitle]Hola").trim(), "*Hola*");
  assertEqual(toMarkdown("[quote]Hola").trim(), "> Hola");
});

// --- editor.js#setParagraphStyle ---

function makeEditor(text, caret) {
  const textarea = document.createElement("textarea");
  document.body.appendChild(textarea);
  const editor = new Editor(textarea);
  editor.setText(text, caret);
  return editor;
}

test("setParagraphStyle: agrega el marcador al principio del párrafo del cursor", () => {
  const editor = makeEditor("Hola mundo", 3);
  editor.setParagraphStyle("h1");
  assertEqual(editor.getText(), "[h1]Hola mundo");
});

test("setParagraphStyle: reemplaza un estilo previo del mismo párrafo, no lo apila", () => {
  const editor = makeEditor("[h1]Hola mundo", 6);
  editor.setParagraphStyle("quote");
  assertEqual(editor.getText(), "[quote]Hola mundo");
});

test("setParagraphStyle: null/\"\" saca el marcador de estilo", () => {
  const editor = makeEditor("[h1]Hola mundo", 6);
  editor.setParagraphStyle(null);
  assertEqual(editor.getText(), "Hola mundo");
});

test("setParagraphStyle: preserva el alineado existente del párrafo (orden estilo, alineado)", () => {
  const editor = makeEditor("[center]Hola mundo", 10);
  editor.setParagraphStyle("h2");
  assertEqual(editor.getText(), "[h2][center]Hola mundo");
});

test("setParagraphStyle: solo afecta al párrafo del cursor, no a los demás", () => {
  const editor = makeEditor("Uno\n\nDos\n\nTres", 6); // cursor en "Dos"
  editor.setParagraphStyle("quote");
  assertEqual(editor.getText(), "Uno\n\n[quote]Dos\n\nTres");
});

// --- editor.js#setParagraphAlign ---

test("setParagraphAlign: agrega el marcador sin espacio, aunque el párrafo ya tenga estilo", () => {
  const editor = makeEditor("[quote]Hola mundo", 10);
  editor.setParagraphAlign("center");
  assertEqual(editor.getText(), "[quote][center]Hola mundo");
});

test("setParagraphAlign: reemplaza un alineado previo, no lo apila", () => {
  const editor = makeEditor("[center]Hola mundo", 10);
  editor.setParagraphAlign("right");
  assertEqual(editor.getText(), "[right]Hola mundo");
});

test("setParagraphAlign: null saca el marcador de alineado y conserva el estilo", () => {
  const editor = makeEditor("[quote][center]Hola mundo", 15);
  editor.setParagraphAlign(null);
  assertEqual(editor.getText(), "[quote]Hola mundo");
});
