// ============================================================
// markdownOverlay.js
// Convierte el texto plano de la hoja a HTML para pintar negrita,
// cursiva, tachado y subrayado en vivo detrás del <textarea> real
// (ver .editor-overlay en index.html/main.css). No es un parser de
// Markdown completo: alcanza para reconocer los 4 marcadores, nada
// de listas/títulos/enlaces.
//
// A propósito NO se ocultan los marcadores (**/*/~~/++): si el HTML
// generado tuviera menos caracteres que el texto real, el ajuste de
// línea (word-wrap) del overlay dejaría de coincidir con el del
// textarea de abajo. En cambio se muestran atenuados (.md-mark) — el
// texto entre ellos toma el estilo correspondiente.
//
// Sintaxis: **negrita**, *cursiva*, ~~tachado~~, ++subrayado++.
// ============================================================

const MD_RE = /\*\*([^\n]+?)\*\*|~~([^\n]+?)~~|\+\+([^\n]+?)\+\+|\*([^\n*]+?)\*/g;

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function markSpan(cls, mark, content) {
  return (
    `<span class="md-mark ${cls}">${mark}</span>` +
    `<span class="${cls}">${content}</span>` +
    `<span class="md-mark ${cls}">${mark}</span>`
  );
}

export function renderOverlayHtml(text) {
  const html = escapeHtml(text).replace(
    MD_RE,
    (whole, bold, strike, underline, italic) => {
      if (bold !== undefined) return markSpan("md-bold", "**", bold);
      if (strike !== undefined) return markSpan("md-strike", "~~", strike);
      if (underline !== undefined) return markSpan("md-underline", "++", underline);
      if (italic !== undefined) return markSpan("md-italic", "*", italic);
      return whole;
    }
  );
  // Sin esto, un salto de línea final no ocupa renglón (el textarea
  // sí lo muestra) y el overlay queda un renglón más bajo.
  return html + "​";
}
