// ============================================================
// textStyle.js
// Reconoce el ESTILO de párrafo ([title]/[subtitle]/[h1..h4]/[quote])
// al principio de un párrafo — un marcador más, en el mismo espíritu
// que el de alineado (textAlign.js): va antes que él si los dos están
// presentes (orden canónico: estilo, después alineado — ver
// editor.js#setParagraphStyle, que reconstruye el párrafo en ese
// orden cada vez que cambia el estilo, así no importa en qué orden
// los haya aplicado el usuario) y afecta a TODO el párrafo, no a un
// tramo cualquiera.
// ============================================================

const STYLE_RE = /^\[(title|subtitle|h1|h2|h3|h4|quote)\]/;

export function extractStyle(paragraphText) {
  const m = STYLE_RE.exec(paragraphText);
  if (!m) return { style: null, mark: "", body: paragraphText };
  return { style: m[1], mark: m[0], body: paragraphText.slice(m[0].length) };
}
