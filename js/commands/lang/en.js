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

  // Sheet formatting (live bold/italic/strikethrough/underline, see
  // markdownInline.js). Each phrase inserts the Markdown marker and
  // gets said TWICE, to open and to close — same as "quote".
  formatting: {
    "bold": "**",
    "italic": "*",
    "strikethrough": "~~",
    "strike through": "~~",
    "underline": "++",
  },

  // Paragraph alignment (see textAlign.js). Unlike "formatting" this
  // isn't open/close: said ONCE at the start of a paragraph, affects
  // only that paragraph. Value is the keyword editor.js#setParagraphAlign
  // expects (it builds the [center]/etc. marker and replaces any
  // previous alignment on the paragraph instead of stacking it).
  align: {
    "center": "center",
    "justify": "justify",
    "align right": "right",
    "align left": "left",
  },

  // Paragraph style (see textStyle.js and the formatting bar dropdown).
  // Same as "align": said ONCE, replaces any previous style on the
  // paragraph. "normal text"/"remove style" clear it (value "" ->
  // editor.js#setParagraphStyle(null)).
  style: {
    "main title": "title",
    "subtitle": "subtitle",
    "heading one": "h1",
    "heading 1": "h1",
    "heading two": "h2",
    "heading 2": "h2",
    "heading three": "h3",
    "heading 3": "h3",
    "heading four": "h4",
    "heading 4": "h4",
    "block quote": "quote",
    "normal text": "",
    "remove style": "",
  },

  // Switch dictation language by voice (deliberately a distinctive
  // phrase, so it doesn't fire just because a language name shows up
  // in normal speech). Value is the family key in config.js.
  languages: {
    "switch to spanish": "es",
    "switch to french": "fr",
    "switch to portuguese": "pt",
    "switch to german": "de",
    "switch to italian": "it",
    "switch to chinese": "zh",
    "switch to japanese": "ja",
  },

  // Escape hatch: "literal <word>" inserts the word as-is.
  // E.g.: "literal period" types "period", not the "." sign.
  literalPrefix: "literal",
};
