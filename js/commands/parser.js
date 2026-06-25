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
// ============================================================

function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function wordCount(s) {
  return s.trim().split(/\s+/).length;
}

export function createParser(lexicon) {
  const entries = [];
  const add = (map, kind) => {
    for (const [phrase, value] of Object.entries(map)) {
      entries.push({ phrase, kind, value });
    }
  };
  add(lexicon.punctuation, "insert");
  add(lexicon.editing, "command");
  add(lexicon.casing, "command");
  add(lexicon.history, "command");

  const index = new Map(entries.map((e) => [normalize(e.phrase), e]));
  const maxWords = entries.reduce((m, e) => Math.max(m, wordCount(e.phrase)), 1);
  const literal = normalize(lexicon.literalPrefix);

  function parse(transcript) {
    const original = (transcript || "").trim().split(/\s+/).filter(Boolean);
    const norm = original.map(normalize);
    const tokens = [];
    let buffer = [];

    const flush = () => {
      if (buffer.length) {
        tokens.push({ type: "text", value: buffer.join(" ") });
        buffer = [];
      }
    };

    for (let i = 0; i < original.length; ) {
      // Vía de escape: "literal <palabra>" -> palabra literal (original).
      if (norm[i] === literal) {
        if (i + 1 < original.length) {
          buffer.push(original[i + 1]);
          i += 2;
        } else {
          buffer.push(original[i]);
          i += 1;
        }
        continue;
      }

      // Match codicioso: probamos frases de maxWords..1 palabras.
      let matched = null;
      const maxN = Math.min(maxWords, original.length - i);
      for (let n = maxN; n >= 1; n--) {
        const candidate = norm.slice(i, i + n).join(" ");
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
