// ============================================================
// text-ops.js
// Operaciones puras sobre texto plano (string -> string).
// Sin DOM: el editor y los tests las reutilizan.
// ============================================================

// ¿Hace falta un espacio entre `left` y `right`?
export function joiner(left, right) {
  if (!left || !right) return "";
  const l = left.slice(-1);
  const r = right[0];
  if (/\s/.test(l)) return "";              // ya termina en espacio/salto
  if (/\s/.test(r)) return "";              // ya empieza con espacio/salto
  if (/[.,;:!?)\]}»…]/.test(r)) return "";  // puntuación de cierre se pega
  if (/[¿¡(\[{«"]/.test(l)) return "";      // apertura no lleva espacio después
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
