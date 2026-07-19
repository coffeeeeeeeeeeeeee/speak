// ============================================================
// commands/lang/fr.js
// Léxico de comandos en francés. Solo datos: lo consume el motor
// (engine.js). Para sumar idiomas: crear otro archivo con esta forma
// y registrarlo en config.js.
//
// Los valores de puntuación NO llevan espacios: el espaciado lo
// resuelve text-ops.joiner según el contexto.
// ============================================================

export const fr = {
  code: "fr-FR",

  // Ponctuation -> texte inséré.
  punctuation: {
    "point": ".",
    "point final": ".",
    "virgule": ",",
    "deux points": ":",
    "point-virgule": ";",
    "point virgule": ";",
    "points de suspension": "…",
    "point d'interrogation": "?",
    "point d'exclamation": "!",
    "nouvelle ligne": "\n",
    "à la ligne": "\n",
    "nouveau paragraphe": "\n\n",
    "tiret": "-",
    "tiret cadratin": "—",
    "guillemet": "\"",
    "ouvre parenthèse": "(",
    "ferme parenthèse": ")",
  },

  // Commandes d'édition -> nom de l'action (implémentée par le moteur).
  editing: {
    "supprime le mot": "deleteWord",
    "efface le mot": "deleteWord",
    "supprime le dernier mot": "deleteWord",
    "supprime la phrase": "deleteSentence",
    "efface la phrase": "deleteSentence",
    "supprime la dernière phrase": "deleteSentence",
    "supprime tout": "deleteAll",
    "efface tout": "deleteAll",
    "sélectionne tout": "selectAll",
  },

  // Majuscules / mise en forme du texte brut.
  casing: {
    "majuscule": "capitalizeNext",  // met une majuscule au mot suivant
    "minuscule": "lowercaseNext",
    "tout en majuscules": "upperOn",
    "fin des majuscules": "upperOff",
  },

  // Historique.
  history: {
    "annuler": "undo",
    "rétablir": "redo",
  },

  // Échappement : "littéral <mot>" insère le mot tel quel.
  // Ex. : "littéral point" écrit « point », pas le signe « . ».
  literalPrefix: "littéral",
};
