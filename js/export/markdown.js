// ============================================================
// export/markdown.js
// Markdown a mano: el texto es prosa dictada, no Markdown de origen,
// así que solo hace falta escapar lo que dispararía sintaxis por
// accidente (numeral/guion/cita al inicio de línea, marcado inline
// que el usuario no haya escrito a propósito).
//
// `*`/`**`/`~~` NO se escapan: son la sintaxis de negrita/cursiva/
// tachado que ya reconoce el overlay en vivo (ver markdownOverlay.js)
// — si se escaparan acá, exportar a .md rompería el formato que el
// usuario sí quiso escribir.
// ============================================================

import { splitParagraphs } from "../text-ops.js";
import { downloadBlob, defaultName } from "./download.js";
import { extractStyle } from "../textStyle.js";

function escapeInline(s) {
  return s.replace(/[\\`_[\]]/g, "\\$&");
}

function escapeLineStart(line) {
  return line
    .replace(/^([ \t]*)([-*+#>])/, "$1\\$2") // lista/encabezado/cita
    .replace(/^([ \t]*\d+)\./, "$1\\."); // lista numerada "1. "
}

function bodyMd(body) {
  return body
    .split("\n")
    .map((line) => escapeLineStart(escapeInline(line)))
    .join("  \n"); // dos espacios + salto = <br> en Markdown
}

// Estilo de párrafo -> sintaxis MD real (a diferencia del resto, que
// se ESCAPA para que la sintaxis accidental del usuario no dispare
// formato — acá es al revés, es formato real que el usuario sí pidió
// desde el desplegable de estilo). "title" es el único encabezado de
// nivel 1: los títulos de cuerpo bajan un nivel, igual que en HTML
// (ver export/html.js). "subtitle" no tiene sintaxis MD propia, así
// que queda como texto en cursiva.
const STYLE_MD = {
  title: (s) => "# " + s,
  subtitle: (s) => "*" + s + "*",
  h1: (s) => "## " + s,
  h2: (s) => "### " + s,
  h3: (s) => "#### " + s,
  h4: (s) => "##### " + s,
  // Blockquote de MD: "> " en cada línea del párrafo, no solo la primera.
  quote: (s) =>
    s
      .split("  \n")
      .map((line) => "> " + line)
      .join("  \n"),
};

function paragraphMd(p) {
  const { style, body } = extractStyle(p);
  const md = bodyMd(body);
  return STYLE_MD[style] ? STYLE_MD[style](md) : md;
}

export function toMarkdown(text) {
  const paragraphs = splitParagraphs(text);
  return paragraphs.length ? paragraphs.map(paragraphMd).join("\n\n") + "\n" : "";
}

export function exportMarkdown(text, filename) {
  downloadBlob(
    toMarkdown(text),
    "text/markdown;charset=utf-8",
    filename || defaultName("md")
  );
}
