// ============================================================
// export/formats.js
// Registro de formatos para el menú de exportar: cada uno sabe su
// etiqueta y cómo ejecutarse. Agregar un formato nuevo es sumarlo acá
// (y al import correspondiente) — export/menu.js itera esta lista
// sin necesidad de conocer los formatos de antemano.
// ============================================================

import { exportTxt } from "./txt.js";
import { exportHtml } from "./html.js";
import { exportRtf } from "./rtf.js";
import { printPdf } from "./print.js";

// `getLang`/`getTitle` son callbacks: se leen recién al exportar, así
// siempre reflejan el idioma activo en ese momento (puede cambiar
// entre que se abre el menú y se hace clic en un ítem).
export function createFormats({ getLang, getTitle }) {
  return [
    { id: "txt", label: "TXT", run: (text) => exportTxt(text) },
    {
      id: "html",
      label: "HTML",
      run: (text) => exportHtml(text, null, { lang: getLang(), title: getTitle() }),
    },
    { id: "rtf", label: "RTF", run: (text) => exportRtf(text) },
    {
      id: "pdf",
      label: "PDF",
      print: true, // no descarga: abre el diálogo de impresión (ver print.js)
      run: (text) => printPdf(text, { title: getTitle() }),
    },
  ];
}
