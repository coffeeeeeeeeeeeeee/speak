// ============================================================
// export/html.js
// Documento HTML autocontenido: un párrafo por <p>, los saltos de
// línea sueltos ("nueva línea") como <br>. Sin dependencias de la app
// (fuentes del sistema) para que se vea bien abierto suelto.
// ============================================================

import { splitParagraphs } from "../text-ops.js";
import { downloadBlob, defaultName } from "./download.js";

export function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// La reusa print.js para armar la hoja imprimible sin duplicar el escapado.
export function paragraphHtml(p) {
  return p
    .split("\n")
    .map(esc)
    .join("<br>\n      ");
}

export function toHtml(text, { lang = "es", title = "speakly" } = {}) {
  const paragraphs = splitParagraphs(text);
  const body = paragraphs.length
    ? paragraphs.map((p) => `  <p>\n      ${paragraphHtml(p)}\n  </p>`).join("\n")
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
