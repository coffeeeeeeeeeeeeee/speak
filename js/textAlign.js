// ============================================================
// textAlign.js
// Reconoce el marcador de alineado al INICIO de un párrafo: [center],
// [right], [left], [justify]. A diferencia de negrita/cursiva/tachado/
// subrayado (que envuelven un tramo de texto, ver markdownInline.js),
// este no es un par apertura/cierre: marca el párrafo ENTERO donde
// aparece, nada más. Por eso el marcador y el alineado son universales
// (en inglés, como los control words de RTF o `text-align` de CSS) —
// consistente con que **/*/~~/++ tampoco cambian según el idioma de
// dictado.
// ============================================================

const ALIGN_RE = /^\[(center|right|left|justify)\]/;

export function extractAlign(paragraphText) {
  const m = ALIGN_RE.exec(paragraphText);
  if (!m) return { align: null, mark: "", body: paragraphText };
  return { align: m[1], mark: m[0], body: paragraphText.slice(m[0].length) };
}
