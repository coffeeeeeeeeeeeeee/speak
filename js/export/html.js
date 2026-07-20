// ============================================================
// export/html.js
// Documento HTML autocontenido: un párrafo por <p>, los saltos de
// línea sueltos ("nueva línea") como <br>. Sin dependencias de la app
// (fuentes del sistema) para que se vea bien abierto suelto.
//
// La negrita/cursiva/tachado/subrayado en vivo de la hoja
// (**/*/~~/++, ver markdownInline.js) se traduce acá a <strong>/<em>/
// <s>/<u> reales, y el alineado por párrafo ([center] y cía., ver
// textAlign.js) a `style="text-align:…"` en el <p> — a diferencia del
// overlay en vivo, acá el marcador NO se muestra: es la versión
// "limpia" del documento.
// ============================================================

import { splitParagraphs } from "../text-ops.js";
import { downloadBlob, defaultName } from "./download.js";
import { parseInline } from "../markdownInline.js";
import { extractAlign } from "../textAlign.js";

export function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const TAG_BY_TYPE = { bold: "strong", italic: "em", strike: "s", underline: "u" };

function lineHtml(line) {
  return parseInline(line)
    .map((tok) => {
      if (tok.type === "text") return esc(tok.content);
      const tag = TAG_BY_TYPE[tok.type];
      return `<${tag}>${esc(tok.content)}</${tag}>`;
    })
    .join("");
}

export function paragraphHtml(p) {
  return p
    .split("\n")
    .map(lineHtml)
    .join("<br>\n      ");
}

// La reusa print.js para armar cada <p> (con su alineado) sin duplicar la lógica.
export function paragraphBlock(p) {
  const { align, body } = extractAlign(p);
  const styleAttr = align ? ` style="text-align:${align}"` : "";
  return { styleAttr, html: paragraphHtml(body) };
}

export function toHtml(text, { lang = "es", title = "speakly" } = {}) {
  const paragraphs = splitParagraphs(text);
  const body = paragraphs.length
    ? paragraphs
        .map((p) => {
          const { styleAttr, html } = paragraphBlock(p);
          return `  <p${styleAttr}>\n      ${html}\n  </p>`;
        })
        .join("\n")
    : "";
  return `<!DOCTYPE html>
<html lang="${esc(lang)}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <style>
    body {
      max-width: 46rem;
      margin: 3rem auto;
      padding: 0 1.5rem;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.1rem;
      line-height: 1.7;
      color: #1b1c1e;
    }
    p { margin: 0 0 1.2em; white-space: pre-wrap; }
  </style>
</head>
<body>
${body}
</body>
</html>
`;
}

export function exportHtml(text, filename, opts) {
  downloadBlob(
    toHtml(text, opts),
    "text/html;charset=utf-8",
    filename || defaultName("html")
  );
}
