// ============================================================
// markdownOverlay.js
// Convierte el texto plano de la hoja a HTML para pintar negrita,
// cursiva, tachado, subrayado y alineado en vivo detrás del
// <textarea> real (ver .editor-overlay en index.html/main.css). El
// reconocimiento de la sintaxis es compartido con la exportación —
// ver markdownInline.js (**/*/~~/++) y textAlign.js ([center] y cía).
//
// A propósito NO se ocultan los marcadores: si el HTML generado
// tuviera menos caracteres que el texto real, el ajuste de línea
// (word-wrap) del overlay dejaría de coincidir con el del textarea de
// abajo. En cambio se muestran atenuados (.md-mark) — el texto entre
// ellos toma el estilo correspondiente.
//
// El alineado es por PÁRRAFO (a diferencia de negrita/etc., que
// envuelven un tramo cualquiera): cada párrafo se pinta en su propio
// <div>, con el separador en blanco (\n\n o más) pegado adentro para
// que la altura total siga calzando con la del textarea de abajo, que
// es un solo bloque de texto plano. `text-align` no cambia dónde cae
// el ajuste de línea (solo la posición horizontal de cada renglón ya
// partido), así que separar en <div>s no desalinea nada.
// ============================================================

import { parseInline } from "./markdownInline.js";
import { extractAlign } from "./textAlign.js";

const CLASS_BY_TYPE = {
  bold: "md-bold",
  italic: "md-italic",
  strike: "md-strike",
  underline: "md-underline",
};

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function markSpan(cls, mark, content) {
  return (
    `<span class="md-mark ${cls}">${mark}</span>` +
    `<span class="${cls}">${escapeHtml(content)}</span>` +
    `<span class="md-mark ${cls}">${mark}</span>`
  );
}

function renderInlineHtml(text) {
  return parseInline(text)
    .map((tok) =>
      tok.type === "text"
        ? escapeHtml(tok.content)
        : markSpan(CLASS_BY_TYPE[tok.type], tok.mark, tok.content)
    )
    .join("");
}

// Divide preservando el separador (\n{2,}) pegado al párrafo
// anterior, para poder reconstruir el string original carácter por
// carácter entre todos los <div> — ver nota de altura arriba.
function splitParagraphChunks(text) {
  const parts = text.split(/(\n{2,})/);
  const chunks = [];
  for (let i = 0; i < parts.length; i += 2) {
    chunks.push(parts[i] + (parts[i + 1] || ""));
  }
  return chunks;
}

export function renderOverlayHtml(text) {
  const html = splitParagraphChunks(text)
    .map((chunk) => {
      const { align, mark, body } = extractAlign(chunk);
      const style = align ? ` style="text-align:${align}"` : "";
      const markHtml = mark ? `<span class="md-mark">${escapeHtml(mark)}</span>` : "";
      return `<div class="md-para"${style}>${markHtml}${renderInlineHtml(body)}</div>`;
    })
    .join("");
  // Sin esto, un salto de línea final no ocupa renglón (el textarea
  // sí lo muestra) y el overlay queda un renglón más bajo.
  return html + "​";
}
