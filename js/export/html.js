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
import { extractStyle } from "../textStyle.js";

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

// Estilo de párrafo (título/subtítulo/cita/etc., ver textStyle.js) ->
// etiqueta HTML real. "title" se queda con <h1> (el título del
// documento) y los títulos de cuerpo bajan un nivel (h2..h5) para no
// competir con él; "subtitle" no tiene equivalente semántico propio
// en HTML, así que es un <p class="subtitle"> con su tipografía en el
// <style> de abajo.
const TAG_BY_STYLE = { title: "h1", h1: "h2", h2: "h3", h3: "h4", h4: "h5", quote: "blockquote" };

// La reusa print.js para armar cada bloque (con su etiqueta/alineado)
// sin duplicar la lógica.
export function paragraphBlock(p) {
  const { style, body: afterStyle } = extractStyle(p);
  const { align, body } = extractAlign(afterStyle);
  const tag = TAG_BY_STYLE[style] || "p";
  const classAttr = style === "subtitle" ? ' class="subtitle"' : "";
  const styleAttr = align ? ` style="text-align:${align}"` : "";
  return { tag, classAttr, styleAttr, html: paragraphHtml(body) };
}

export function toHtml(text, { lang = "es", title = "Bossa Studio" } = {}) {
  const paragraphs = splitParagraphs(text);
  const body = paragraphs.length
    ? paragraphs
        .map((p) => {
          const { tag, classAttr, styleAttr, html } = paragraphBlock(p);
          return `  <${tag}${classAttr}${styleAttr}>\n      ${html}\n  </${tag}>`;
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
    p, blockquote { margin: 0 0 1.2em; white-space: pre-wrap; }
    h1, h2, h3, h4, h5 { margin: 1.2em 0 0.5em; font-weight: 600; line-height: 1.25; }
    h1 { font-size: 2.1em; }
    h2 { font-size: 1.6em; }
    h3 { font-size: 1.35em; }
    h4 { font-size: 1.15em; }
    h5 { font-size: 1.05em; }
    p.subtitle { font-style: italic; font-size: 1.2em; color: #5a5c5e; }
    blockquote {
      padding-left: 1em;
      font-style: italic;
      color: #5a5c5e;
      border-left: 3px solid #e2e3df;
    }
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
