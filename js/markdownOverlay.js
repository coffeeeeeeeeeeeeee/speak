// ============================================================
// markdownOverlay.js
// Convierte el texto plano de la hoja a HTML para pintar negrita,
// cursiva, tachado, subrayado, alineado y estilo de párrafo (título/
// cita/etc.) en vivo detrás del <textarea> real (ver .editor-overlay
// en index.html/main.css). El reconocimiento de la sintaxis es
// compartido con la exportación — ver markdownInline.js (**/*/~~/++),
// textAlign.js ([center] y cía.) y textStyle.js ([title]/[h1]/[quote]
// y cía.).
//
// El estilo de párrafo SOLO cambia peso/color/cursiva en el overlay,
// nunca font-size: el tamaño de letra sí mueve el punto donde se
// corta la línea (a diferencia de text-align), y como el <textarea>
// real es un solo tamaño para todo el documento, un párrafo más
// grande en el overlay desalinearía su ajuste de línea (y en cascada,
// la posición vertical de todo lo que sigue) respecto del textarea de
// abajo. La jerarquía tipográfica "de verdad" (con tamaños distintos)
// vive en la exportación (HTML/PDF/RTF), donde no hay ese problema.
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
import { extractStyle } from "./textStyle.js";

const STYLE_CLASS = {
  title: "md-style-title",
  subtitle: "md-style-subtitle",
  h1: "md-style-h1",
  h2: "md-style-h2",
  h3: "md-style-h3",
  h4: "md-style-h4",
  quote: "md-style-quote",
};

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
      const { style, mark: styleMark, body: afterStyle } = extractStyle(chunk);
      const { align, mark: alignMark, body } = extractAlign(afterStyle);
      const styleClass = style ? ` ${STYLE_CLASS[style]}` : "";
      const alignStyle = align ? ` style="text-align:${align}"` : "";
      const markHtml =
        (styleMark ? `<span class="md-mark">${escapeHtml(styleMark)}</span>` : "") +
        (alignMark ? `<span class="md-mark">${escapeHtml(alignMark)}</span>` : "");
      return `<div class="md-para${styleClass}"${alignStyle}>${markHtml}${renderInlineHtml(body)}</div>`;
    })
    .join("");
  // Sin esto, un salto de línea final no ocupa renglón (el textarea
  // sí lo muestra) y el overlay queda un renglón más bajo.
  return html + "​";
}
