// ============================================================
// commands/parser.js
// Segmenta un transcript final en una secuencia de tokens:
//   { type: "text",    value: "hola mundo" }   // dictado (texto original)
//   { type: "insert",  value: "." }             // puntuación
//   { type: "command", action: "deleteWord" }   // acción de edición
//
// Robustez de la detección automática (sin palabra clave):
//   - léxico CERRADO: solo lo definido en el idioma es comando,
//   - match codicioso: las frases más largas ganan
//     ("punto y aparte" antes que "punto"),
//   - el match se hace sobre una versión NORMALIZADA (minúsculas, sin
//     tildes), pero el texto dictado se conserva TAL CUAL (con tildes
//     y mayúsculas),
//   - prefijo "literal" fuerza la palabra como texto literal.
//
// Chino/japonés no separan palabras con espacios: para esos idiomas el
// léxico marca `tokenize: "char"` y la unidad mínima pasa a ser el
// CARÁCTER en vez de la palabra (tanto para partir el transcript como
// para reconstruir frases/buffer, que ahí se unen sin espacio).
// ============================================================

function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function tokenCount(s, byChar) {
  return byChar ? Array.from(s.trim()).length : s.trim().split(/\s+/).length;
}

export function createParser(lexicon) {
  const byChar = lexicon.tokenize === "char";
  const sep = byChar ? "" : " ";

  const entries = [];
  const add = (map, kind) => {
    for (const [phrase, value] of Object.entries(map)) {
      entries.push({ phrase, kind, value });
    }
  };
  add(lexicon.punctuation, "insert");
  add(lexicon.formatting || {}, "insert");
  add(lexicon.align || {}, "insert");
  add(lexicon.editing, "command");
  add(lexicon.casing, "command");
  add(lexicon.history, "command");
  add(lexicon.languages || {}, "language");

  const index = new Map(entries.map((e) => [normalize(e.phrase), e]));
  const maxWords = entries.reduce((m, e) => Math.max(m, tokenCount(e.phrase, byChar)), 1);
  const literal = normalize(lexicon.literalPrefix);
  // En modo palabra el prefijo siempre ocupa 1 token ("literal"); en modo
  // carácter puede ocupar varios (p. ej. "字面" son 2 caracteres) — sin esto
  // la comparación de abajo nunca sería cierta para esos léxicos.
  const literalLen = tokenCount(lexicon.literalPrefix, byChar);

  function parse(transcript) {
    const original = byChar
      ? Array.from((transcript || "").trim())
      : (transcript || "").trim().split(/\s+/).filter(Boolean);
    const norm = original.map(normalize);
    const tokens = [];
    let buffer = [];

    const flush = () => {
      if (buffer.length) {
        tokens.push({ type: "text", value: buffer.join(sep) });
        buffer = [];
      }
    };

    for (let i = 0; i < original.length; ) {
      // Vía de escape: "literal <palabra>" -> palabra literal (original).
      if (norm.slice(i, i + literalLen).join(sep) === literal) {
        const after = i + literalLen;
        if (after < original.length) {
          buffer.push(original[after]);
          i = after + 1;
        } else {
          buffer.push(...original.slice(i, after)); // el prefijo solo, sin nada después
          i = after;
        }
        continue;
      }

      // Match codicioso: probamos frases de maxWords..1 palabras (o
      // caracteres, en léxicos `tokenize: "char"`).
      let matched = null;
      const maxN = Math.min(maxWords, original.length - i);
      for (let n = maxN; n >= 1; n--) {
        const candidate = norm.slice(i, i + n).join(sep);
        if (index.has(candidate)) {
          matched = { entry: index.get(candidate), n };
          break;
        }
      }

      if (matched) {
        flush();
        const { entry } = matched;
        if (entry.kind === "insert") {
          tokens.push({ type: "insert", value: entry.value });
        } else if (entry.kind === "language") {
          tokens.push({ type: "language", value: entry.value });
        } else {
          tokens.push({ type: "command", action: entry.value });
        }
        i += matched.n;
      } else {
        buffer.push(original[i]); // texto original (con tildes/mayúsculas)
        i += 1;
      }
    }
    flush();
    return tokens;
  }

  return { parse };
}
