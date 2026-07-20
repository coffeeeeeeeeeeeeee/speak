// ============================================================
// markdownInline.js
// Parser mínimo y compartido del marcado inline que reconoce la app:
// **negrita**, *cursiva*, ~~tachado~~, ++subrayado++. No arma HTML/
// RTF directamente: devuelve una lista de tokens de texto plano y
// tramos marcados, para que cada consumidor lo renderice a su manera
// (markdownOverlay.js pinta la hoja en vivo con los marcadores
// atenuados; export/html.js, export/rtf.js y export/print.js —esta
// última reusa a html.js— generan negrita/cursiva/tachado/subrayado
// reales).
// ============================================================

const MD_RE = /\*\*([^\n]+?)\*\*|~~([^\n]+?)~~|\+\+([^\n]+?)\+\+|\*([^\n*]+?)\*/g;

export function parseInline(text) {
  const tokens = [];
  let last = 0;
  let m;
  MD_RE.lastIndex = 0;
  while ((m = MD_RE.exec(text))) {
    if (m.index > last) tokens.push({ type: "text", content: text.slice(last, m.index) });
    const [, bold, strike, underline, italic] = m;
    if (bold !== undefined) tokens.push({ type: "bold", mark: "**", content: bold });
    else if (strike !== undefined) tokens.push({ type: "strike", mark: "~~", content: strike });
    else if (underline !== undefined) tokens.push({ type: "underline", mark: "++", content: underline });
    else tokens.push({ type: "italic", mark: "*", content: italic });
    last = MD_RE.lastIndex;
  }
  if (last < text.length) tokens.push({ type: "text", content: text.slice(last) });
  return tokens;
}
