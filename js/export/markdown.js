// ============================================================
// export/markdown.js
// Markdown a mano: el texto es prosa dictada, no Markdown de origen,
// así que solo hace falta escapar lo que dispararía sintaxis por
// accidente (numeral/guion/cita al inicio de línea, énfasis inline).
// ============================================================

import { splitParagraphs } from "../text-ops.js";
import { downloadBlob, defaultName } from "./download.js";

function escapeInline(s) {
  return s.replace(/[\\`*_[\]]/g, "\\$&");
}

function escapeLineStart(line) {
  return line
    .replace(/^([ \t]*)([-*+#>])/, "$1\\$2") // lista/encabezado/cita
    .replace(/^([ \t]*\d+)\./, "$1\\."); // lista numerada "1. "
}

function paragraphMd(p) {
  return p
    .split("\n")
    .map((line) => escapeLineStart(escapeInline(line)))
    .join("  \n"); // dos espacios + salto = <br> en Markdown
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
