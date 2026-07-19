// ============================================================
// commands/lang/it.js
// Léxico de comandos en italiano. Solo datos: lo consume el motor
// (engine.js). Para sumar idiomas: crear otro archivo con esta forma
// y registrarlo en config.js.
//
// Los valores de puntuación NO llevan espacios: el espaciado lo
// resuelve text-ops.joiner según el contexto.
// ============================================================

export const it = {
  code: "it-IT",

  // Punteggiatura -> testo inserito.
  punctuation: {
    "punto": ".",
    "virgola": ",",
    "due punti": ":",
    "punto e virgola": ";",
    "puntini di sospensione": "…",
    "punto interrogativo": "?",
    "punto esclamativo": "!",
    "nuova riga": "\n",
    "a capo": "\n",
    "nuovo paragrafo": "\n\n",
    "trattino": "-",
    "lineetta": "—",
    "virgolette": "\"",
    "apri parentesi": "(",
    "chiudi parentesi": ")",
  },

  // Comandi di modifica -> nome dell'azione (implementata dal motore).
  editing: {
    "cancella parola": "deleteWord",
    "cancella ultima parola": "deleteWord",
    "cancella frase": "deleteSentence",
    "cancella ultima frase": "deleteSentence",
    "cancella tutto": "deleteAll",
    "seleziona tutto": "selectAll",
  },

  // Maiuscole / formattazione del testo semplice.
  casing: {
    "maiuscola": "capitalizeNext",  // maiuscola alla prossima parola
    "minuscola": "lowercaseNext",
    "tutto maiuscolo": "upperOn",
    "fine maiuscolo": "upperOff",
  },

  // Cronologia.
  history: {
    "annulla": "undo",
    "ripristina": "redo",
  },

  // Escape: "letterale <parola>" scrive la parola così com'è.
  // Es.: "letterale punto" scrive "punto", non il segno ".".
  literalPrefix: "letterale",
};
