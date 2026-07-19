// ============================================================
// text-ops.js
// Operaciones puras sobre texto plano (string -> string).
// Sin DOM: el editor y los tests las reutilizan.
// ============================================================

// Chino/japonés (y su puntuación de ancho completo) no llevan espacio entre
// caracteres/palabras: a diferencia de los idiomas latinos, ahí el espacio
// NO es el default, así que se corta antes de llegar a la regla general.
const CJK_RANGES = [
  [0x3000, 0x303f], // puntuación y símbolos CJK (incluye 。、「」…)
  [0x3040, 0x30ff], // hiragana + katakana
  [0x3400, 0x4dbf], // ideogramas CJK, extensión A
  [0x4e00, 0x9fff], // ideogramas CJK unificados
  [0xff00, 0xffef], // formas de ancho completo
];

function isCJK(ch) {
  if (!ch) return false;
  const cp = ch.codePointAt(0);
  return CJK_RANGES.some(([lo, hi]) => cp >= lo && cp <= hi);
}

// ¿Hace falta un espacio entre `left` y `right`?
export function joiner(left, right) {
  if (!left || !right) return "";
  const l = left.slice(-1);
  const r = right[0];
  if (/\s/.test(l)) return "";              // ya termina en espacio/salto
  if (/\s/.test(r)) return "";              // ya empieza con espacio/salto
  if (/[.,;:!?)\]}»…]/.test(r)) return "";  // puntuación de cierre se pega
  if (/[¿¡(\[{«"]/.test(l)) return "";      // apertura no lleva espacio después
  if (isCJK(l) || isCJK(r)) return "";      // CJK: nunca space por default
  return " ";
}

export function appendText(committed, text) {
  if (!text) return committed;
  return committed + joiner(committed, text) + text;
}

// Borra la última palabra (y la puntuación pegada a ella).
export function deleteLastWord(committed) {
  let t = committed.replace(/\s+$/, "");
  t = t.replace(/\S+$/, "");
  return t.replace(/\s+$/, "");
}

// Borra la última oración hasta el límite anterior (. ! ? o salto de línea).
export function deleteLastSentence(committed) {
  let t = committed.replace(/\s+$/, "");
  t = t.replace(/[.!?]+$/, ""); // soltamos el cierre de la oración actual
  let idx = -1;
  for (let i = t.length - 1; i >= 0; i--) {
    if (".!?\n".includes(t[i])) {
      idx = i;
      break;
    }
  }
  return idx >= 0 ? t.slice(0, idx + 1) : "";
}

// ¿El texto está en un punto donde la siguiente palabra debería ir en mayúscula?
export function endsSentence(committed) {
  if (committed.trim() === "") return true;
  if (/\n$/.test(committed)) return true;
  const t = committed.replace(/[\s¿¡("«]+$/, "");
  if (t === "") return true; // solo signos de apertura => inicio de oración
  return /[.!?]$/.test(t);
}

export function capitalizeFirst(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function lowercaseFirst(text) {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

// Limpia el texto para la salida (exportar / copiar):
// espacios múltiples, espacios antes de puntuación, saltos de más.
export function tidy(text) {
  return (text || "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +([.,;:!?…])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Rango [start, end) de la corrida de no-espacios que arranca en
// `index` — lo usa tts.js cuando el evento `boundary` de
// SpeechSynthesis no trae charLength (pasa con algunas voces/
// navegadores), para saber hasta dónde resaltar esa "palabra".
export function wordSpanAt(text, index) {
  const rest = text.slice(index);
  const match = rest.match(/^\S*/);
  const length = match ? match[0].length : 0;
  return { start: index, end: index + Math.max(length, 1) };
}

// Divide en párrafos (separados por línea en blanco, tal como los deja
// tidy()). Cada párrafo puede tener saltos de línea sueltos adentro
// ("nueva línea", a diferencia de "nuevo párrafo") — lo usan los
// exportadores de export/ para representar la misma estructura en
// distintos formatos (html/rtf/pdf).
export function splitParagraphs(text) {
  const t = (text || "").trim();
  if (!t) return [];
  return t.split(/\n{2,}/);
}

// --- Operaciones en una posición de cursor (caret) ---
// Devuelven { text, caret }.

export function insertAt(text, caret, s) {
  if (!s) return { text, caret };
  const before = text.slice(0, caret);
  const after = text.slice(caret);
  const lsep = joiner(before, s);
  const left = before + lsep + s;
  const rsep = after ? joiner(left, after) : "";
  return { text: left + rsep + after, caret: left.length };
}

export function deleteWordBefore(text, caret) {
  const before = deleteLastWord(text.slice(0, caret));
  const after = text.slice(caret);
  // deleteLastWord ya se comió el espacio separador junto con la palabra: si
  // el cursor estaba pegado al inicio de `after` (caso típico de hacer clic
  // justo antes de una palabra), sin esto quedarían las dos mitades pegadas.
  const sep = after ? joiner(before, after) : "";
  return { text: before + sep + after, caret: before.length };
}

export function deleteSentenceBefore(text, caret) {
  const before = deleteLastSentence(text.slice(0, caret));
  const after = text.slice(caret);
  const sep = after ? joiner(before, after) : "";
  return { text: before + sep + after, caret: before.length };
}
