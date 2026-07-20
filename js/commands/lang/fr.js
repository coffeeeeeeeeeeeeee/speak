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

  // Mise en forme de la feuille (gras/italique/barré/souligné en
  // direct, voir markdownInline.js). Chaque phrase insère le
  // marqueur Markdown et se dit DEUX fois, pour ouvrir et fermer —
  // comme "guillemet".
  formatting: {
    "gras": "**",
    "italique": "*",
    "barré": "~~",
    "souligné": "++",
  },

  // Alignement de paragraphe (voir textAlign.js) : se dit UNE fois au
  // début du paragraphe, pas d'ouverture/fermeture comme "formatting".
  align: {
    "centrer": "center",
    "justifier": "justify",
    "aligner à droite": "right",
    "aligner à gauche": "left",
  },

  // Style de paragraphe (voir textStyle.js et le menu de la barre
  // d'édition). Comme "align" : se dit UNE fois, remplace le style
  // précédent. "texte normal"/"supprimer le style" l'enlèvent.
  style: {
    "titre principal": "title",
    "sous-titre": "subtitle",
    "titre un": "h1",
    "titre 1": "h1",
    "titre deux": "h2",
    "titre 2": "h2",
    "titre trois": "h3",
    "titre 3": "h3",
    "titre quatre": "h4",
    "titre 4": "h4",
    "citation": "quote",
    "texte normal": "",
    "supprimer le style": "",
  },

  // Changer de langue de dictée à la voix (phrase distincte à dessein,
  // pour ne pas se déclencher si le nom d'une langue apparaît dans une
  // phrase normale). La valeur est la clé de famille dans config.js.
  languages: {
    "passer en espagnol": "es",
    "passer en anglais": "en",
    "passer en portugais": "pt",
    "passer en allemand": "de",
    "passer en italien": "it",
    "passer en chinois": "zh",
    "passer en japonais": "ja",
  },

  // Échappement : "littéral <mot>" insère le mot tel quel.
  // Ex. : "littéral point" écrit « point », pas le signe « . ».
  literalPrefix: "littéral",
};
