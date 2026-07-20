import { test, assertEqual, assertTrue } from "./tiny-test.js";
import { toTxt } from "../js/export/txt.js";
import { toHtml, esc } from "../js/export/html.js";
import { toRtf } from "../js/export/rtf.js";
import { extractAlign } from "../js/textAlign.js";

// --- txt ---

test("toTxt: pasa el texto tal cual", () => {
  assertEqual(toTxt("Hola\n\nMundo."), "Hola\n\nMundo.");
});

test("toTxt: null/undefined no rompen", () => {
  assertEqual(toTxt(null), "");
  assertEqual(toTxt(undefined), "");
});

// --- html ---

test("esc: escapa & < > (no comillas, no hace falta fuera de atributos)", () => {
  assertEqual(esc("a & b < c > d"), "a &amp; b &lt; c &gt; d");
});

test("toHtml: un párrafo por <p>, sin párrafos de más", () => {
  const html = toHtml("Primer párrafo.\n\nSegundo párrafo.");
  const count = (html.match(/<p>/g) || []).length;
  assertEqual(count, 2);
  assertTrue(html.includes("Primer párrafo."), "conserva el primer párrafo");
  assertTrue(html.includes("Segundo párrafo."), "conserva el segundo párrafo");
});

test("toHtml: salto de línea suelto dentro de un párrafo es <br>, no <p> nuevo", () => {
  const html = toHtml("Línea uno\nLínea dos");
  assertEqual((html.match(/<p>/g) || []).length, 1);
  assertTrue(html.includes("<br>"), "usa <br> para el salto suelto");
});

test("toHtml: escapa HTML en el contenido dictado", () => {
  const html = toHtml("1 < 2 & 3 > 0");
  assertTrue(html.includes("1 &lt; 2 &amp; 3 &gt; 0"), "escapa el texto del usuario");
  assertTrue(!html.includes("1 < 2 & 3 > 0"), "no deja el original sin escapar");
});

test("toHtml: documento autocontenido con charset y lang", () => {
  const html = toHtml("hola", { lang: "en-US", title: "mi doc" });
  assertTrue(html.includes("<!DOCTYPE html>"), "tiene doctype");
  assertTrue(html.includes('meta charset="UTF-8"'), "declara utf-8");
  assertTrue(html.includes('lang="en-US"'), "usa el idioma pasado");
  assertTrue(html.includes("<title>mi doc</title>"), "usa el título pasado");
});

test("toHtml: texto vacío no rompe (sin párrafos)", () => {
  const html = toHtml("");
  assertEqual((html.match(/<p>/g) || []).length, 0);
});

test("toHtml: [center] al inicio de párrafo agrega style y no deja el marcador", () => {
  const html = toHtml("[center]Hola mundo.");
  assertTrue(html.includes('<p style="text-align:center">'), "agrega el style de alineado");
  assertTrue(!html.includes("[center]"), "no deja el marcador visible");
  assertTrue(html.includes("Hola mundo."), "conserva el texto del párrafo");
});

test("toHtml: párrafo sin marcador de alineado no agrega style", () => {
  const html = toHtml("Hola mundo.");
  assertTrue(html.includes("<p>\n"), "sin style cuando no hay marcador");
});

// --- textAlign ---

test("extractAlign: reconoce [center]/[right]/[left]/[justify] al inicio", () => {
  assertEqual(extractAlign("[center]Hola").align, "center");
  assertEqual(extractAlign("[right]Hola").align, "right");
  assertEqual(extractAlign("[left]Hola").align, "left");
  assertEqual(extractAlign("[justify]Hola").align, "justify");
  assertEqual(extractAlign("[center]Hola").body, "Hola");
});

test("extractAlign: sin marcador, align null y body sin tocar", () => {
  const r = extractAlign("Hola [center] mundo");
  assertEqual(r.align, null);
  assertEqual(r.body, "Hola [center] mundo");
});

// --- rtf ---

test("toRtf: separa párrafos con \\par y saltos sueltos con \\line", () => {
  const rtf = toRtf("Uno\nDos\n\nTres.");
  assertTrue(rtf.includes("Uno\\line\nDos"), "usa \\line dentro del párrafo");
  assertTrue(rtf.includes("Dos\\par\n\\pard\\ql Tres."), "usa \\par entre párrafos");
});

test("toRtf: cada párrafo arranca con \\pard\\ql por defecto (sin alineado explícito)", () => {
  const rtf = toRtf("Hola.");
  assertTrue(rtf.includes("\\pard\\ql Hola."), "alinea a la izquierda por defecto");
});

test("toRtf: [center]/[right]/[justify] al inicio de párrafo traducen a \\qc/\\qr/\\qj", () => {
  assertTrue(toRtf("[center]Hola").includes("\\pard\\qc Hola"), "centra");
  assertTrue(toRtf("[right]Hola").includes("\\pard\\qr Hola"), "alinea a la derecha");
  assertTrue(toRtf("[justify]Hola").includes("\\pard\\qj Hola"), "justifica");
  assertTrue(!toRtf("[center]Hola").includes("[center]"), "no deja el marcador en el texto");
});

test("toRtf: caracteres no-ASCII se escapan como \\uN?", () => {
  const rtf = toRtf("café 你好");
  // é = 233, 你 = 20320, 好 = 22909 (todos < 32768, sin necesidad de negativos)
  assertTrue(rtf.includes("caf\\u233?"), "escapa la tilde");
  assertTrue(rtf.includes("\\u20320?\\u22909?"), "escapa los caracteres chinos");
});

test("toRtf: escapa backslash y llaves literales del texto dictado", () => {
  const rtf = toRtf("100% \\ {llave} listo");
  assertTrue(rtf.includes("100% \\\\ \\{llave\\} listo"), "escapa \\, { y }");
});

test("toRtf: arranca con la cabecera RTF mínima válida", () => {
  const rtf = toRtf("hola");
  assertTrue(rtf.startsWith("{\\rtf1"), "empieza con {\\rtf1");
  assertTrue(rtf.trim().endsWith("}"), "cierra el grupo raíz");
});
