// ============================================================
// export/rtf.js
// RTF a mano: es texto plano con control words, no hace falta
// ninguna librería. Cada carácter no-ASCII (tildes, CJK, etc.) se
// escapa como \uN? (entero con signo de 16 bits + carácter de
// respaldo), que es como RTF representa Unicode desde siempre.
//
// La negrita/cursiva/tachado/subrayado en vivo de la hoja (**/*/~~/
// ++, ver markdownInline.js) se traduce acá a los control words
// \b/\i/\strike/\ul reales, cada uno en su propio grupo {…} para que
// el formato no se filtre al texto que sigue.
// ============================================================

import { splitParagraphs } from "../text-ops.js";
import { downloadBlob, defaultName } from "./download.js";
import { parseInline } from "../markdownInline.js";

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

const RTF_ON = { bold: "\\b", italic: "\\i", strike: "\\strike", underline: "\\ul" };

function lineRtf(line) {
  return parseInline(line)
    .map((tok) =>
      tok.type === "text"
        ? escapeRtfChars(tok.content)
        : `{${RTF_ON[tok.type]} ${escapeRtfChars(tok.content)}}`
    )
    .join("");
}

function paragraphRtf(p) {
  return p.split("\n").map(lineRtf).join("\\line\n");
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
