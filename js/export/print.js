// ============================================================
// export/print.js
// "PDF" sin generar bytes PDF: arma una hoja imprimible oculta
// (#printSheet, ver index.html) y dispara el diálogo nativo de
// impresión del navegador — el usuario elige "Guardar como PDF" ahí.
// Funciona con cualquier idioma/tipografía sin librerías ni fuentes
// embebidas, a cambio de un paso manual extra para el usuario.
// ============================================================

import { splitParagraphs } from "../text-ops.js";
import { paragraphHtml } from "./html.js";

export function printPdf(text, { title } = {}) {
  const sheet = document.getElementById("printSheet");
  if (!sheet) return;

  const paragraphs = splitParagraphs(text);
  sheet.innerHTML = paragraphs.length
    ? paragraphs.map((p) => `<p>${paragraphHtml(p)}</p>`).join("\n")
    : "";

  const previousTitle = document.title;
  if (title) document.title = title; // sugiere el nombre en "Guardar como PDF"

  const restore = () => {
    document.title = previousTitle;
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);

  window.print();
}
