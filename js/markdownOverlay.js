// ============================================================
// markdownOverlay.js
// Convierte el texto plano de la hoja a HTML para pintar negrita,
// cursiva, tachado y subrayado en vivo detrás del <textarea> real
// (ver .editor-overlay en index.html/main.css). El reconocimiento de
// la sintaxis (**/*/~~/++) es compartido con la exportación — ver
// markdownInline.js.
//
// A propósito NO se ocultan los marcadores: si el HTML generado
// tuviera menos caracteres que el texto real, el ajuste de línea
// (word-wrap) del overlay dejaría de coincidir con el del textarea de
// abajo. En cambio se muestran atenuados (.md-mark) — el texto entre
// ellos toma el estilo correspondiente.
// ============================================================

import { parseInline } from "./markdownInline.js";

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

export function renderOverlayHtml(text) {
  const html = parseInline(text)
    .map((tok) =>
      tok.type === "text"
        ? escapeHtml(tok.content)
        : markSpan(CLASS_BY_TYPE[tok.type], tok.mark, tok.content)
    )
    .join("");
  // Sin esto, un salto de línea final no ocupa renglón (el textarea
  // sí lo muestra) y el overlay queda un renglón más bajo.
  return html + "​";
}
