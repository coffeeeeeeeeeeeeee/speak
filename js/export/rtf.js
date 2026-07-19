// ============================================================
// export/rtf.js
// RTF a mano: es texto plano con control words, no hace falta
// ninguna librería. Cada carácter no-ASCII (tildes, CJK, etc.) se
// escapa como \uN? (entero con signo de 16 bits + carácter de
// respaldo), que es como RTF representa Unicode desde siempre.
// ============================================================

import { splitParagraphs } from "../text-ops.js";
import { downloadBlob, defaultName } from "./download.js";

function escapeRtfChars(s) {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const code = s.charCodeAt(i);
    if (ch === "\\" || ch === "{" || ch === "}") {
      out += "\\" + ch;
    } else if (code < 128) {
      out += ch;
    } else {
      // \u quiere un int con signo de 16 bits (unidad UTF-16, no code point).
      const signed = code > 32767 ? code - 65536 : code;
      out += `\\u${signed}?`;
    }
  }
  return out;
}

function paragraphRtf(p) {
  return p.split("\n").map(escapeRtfChars).join("\\line\n");
}

export function toRtf(text) {
  const paragraphs = splitParagraphs(text);
  const body = paragraphs.map(paragraphRtf).join("\\par\n");
  return `{\\rtf1\\ansi\\ansicpg1252\\deff0\\uc1
{\\fonttbl{\\f0\\froman Georgia;}}
\\f0\\fs28
${body}
}
`;
}

export function exportRtf(text, filename) {
  downloadBlob(toRtf(text), "application/rtf", filename || defaultName("rtf"));
}
