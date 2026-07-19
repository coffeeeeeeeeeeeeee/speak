// ============================================================
// commands/lang/en.js
// English command lexicon. Data only: the engine (engine.js) is the
// one that consumes it. To add a language: create another file with
// this shape and register it in config.js.
//
// Punctuation values carry NO spacing: text-ops.joiner resolves
// spacing from context.
// ============================================================

export const en = {
  code: "en-US",

  // Punctuation -> text that gets inserted.
  punctuation: {
    "period": ".",
    "full stop": ".",
    "comma": ",",
    "colon": ":",
    "semicolon": ";",
    "ellipsis": "…",
    "dot dot dot": "…",
    "question mark": "?",
    "exclamation mark": "!",
    "exclamation point": "!",
    "new line": "\n",
    "newline": "\n",
    "new paragraph": "\n\n",
    "dash": "-",
    "hyphen": "-",
    "em dash": "—",
    "quote": "\"",
    "quotation mark": "\"",
    "open parenthesis": "(",
    "close parenthesis": ")",
  },

  // Editing commands -> action name (implemented by the engine).
  editing: {
    "delete word": "deleteWord",
    "delete last word": "deleteWord",
    "delete sentence": "deleteSentence",
    "delete last sentence": "deleteSentence",
    "delete all": "deleteAll",
    "clear all": "deleteAll",
    "select all": "selectAll",
  },

  // Casing / plain-text formatting.
  casing: {
    "capitalize": "capitalizeNext",  // capitalizes the next word
    "capital": "capitalizeNext",
    "lowercase": "lowercaseNext",
    "all caps": "upperOn",
    "caps on": "upperOn",
    "caps off": "upperOff",
    "end caps": "upperOff",
  },

  // History.
  history: {
    "undo": "undo",
    "redo": "redo",
  },

  // Escape hatch: "literal <word>" inserts the word as-is.
  // E.g.: "literal period" types "period", not the "." sign.
  literalPrefix: "literal",
};
