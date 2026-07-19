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

  // Cambia lingua di dettatura a voce (frase distintiva apposta, per
  // non attivarsi solo perché il nome di una lingua compare in una
  // frase normale). Il valore è la chiave di famiglia in config.js.
  languages: {
    "passa a spagnolo": "es",
    "passa a inglese": "en",
    "passa a francese": "fr",
    "passa a portoghese": "pt",
    "passa a tedesco": "de",
    "passa a cinese": "zh",
    "passa a giapponese": "ja",
  },

  // Escape: "letterale <parola>" scrive la parola così com'è.
  // Es.: "letterale punto" scrive "punto", non il segno ".".
  literalPrefix: "letterale",
};
