// ============================================================
// commands/lang/de.js
// Léxico de comandos en alemán. Solo datos: lo consume el motor
// (engine.js). Para sumar idiomas: crear otro archivo con esta forma
// y registrarlo en config.js.
//
// Los valores de puntuación NO llevan espacios: el espaciado lo
// resuelve text-ops.joiner según el contexto.
// ============================================================

export const de = {
  // Satzzeichen -> eingefügter Text.
  punctuation: {
    "punkt": ".",
    "komma": ",",
    "doppelpunkt": ":",
    "semikolon": ";",
    "auslassungspunkte": "…",
    "fragezeichen": "?",
    "ausrufezeichen": "!",
    "neue zeile": "\n",
    "zeilenumbruch": "\n",
    "neuer absatz": "\n\n",
    "bindestrich": "-",
    "gedankenstrich": "—",
    "anführungszeichen": "\"",
    "klammer auf": "(",
    "klammer zu": ")",
  },

  // Bearbeitungsbefehle -> Aktionsname (vom Engine implementiert).
  editing: {
    "wort löschen": "deleteWord",
    "letztes wort löschen": "deleteWord",
    "satz löschen": "deleteSentence",
    "letzten satz löschen": "deleteSentence",
    "alles löschen": "deleteAll",
    "alles auswählen": "selectAll",
  },

  // Groß-/Kleinschreibung im Klartext.
  casing: {
    "großschreiben": "capitalizeNext",  // nächstes Wort großschreiben
    "kleinschreiben": "lowercaseNext",
    "alles großschreiben": "upperOn",
    "großschreibung beenden": "upperOff",
  },

  // Verlauf.
  history: {
    "rückgängig": "undo",
    "wiederholen": "redo",
  },

  // Diktiersprache per Sprachbefehl wechseln (bewusst eine markante
  // Phrase, damit sie nicht auslöst, nur weil ein Sprachname in einem
  // normalen Satz vorkommt). Der Wert ist der Familienschlüssel aus
  // config.js.
  languages: {
    "wechseln zu spanisch": "es",
    "wechseln zu englisch": "en",
    "wechseln zu französisch": "fr",
    "wechseln zu portugiesisch": "pt",
    "wechseln zu italienisch": "it",
    "wechseln zu chinesisch": "zh",
    "wechseln zu japanisch": "ja",
  },

  // Escape: "wörtlich <wort>" schreibt das Wort genau so, wie gesagt.
  // Z. B.: "wörtlich punkt" schreibt "punkt", nicht das Zeichen ".".
  literalPrefix: "wörtlich",
};
