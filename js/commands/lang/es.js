// ============================================================
// commands/lang/es.js
// Léxico de comandos en español. Solo datos: el motor (engine.js)
// lo consume. Para sumar idiomas: crear otro archivo con esta forma.
//
// Los valores de puntuación NO llevan espacios: el espaciado lo
// resuelve text-ops.joiner según el contexto.
// ============================================================

export const es = {
  // Puntuación -> texto que se inserta.
  punctuation: {
    "punto": ".",
    "punto y seguido": ".",
    "punto y aparte": ".\n\n",
    "coma": ",",
    "dos puntos": ":",
    "punto y coma": ";",
    "puntos suspensivos": "…",
    "signo de interrogación": "?",
    "abre interrogación": "¿",
    "cierra interrogación": "?",
    "abre exclamación": "¡",
    "cierra exclamación": "!",
    "signo de exclamación": "!",
    "nueva línea": "\n",
    "salto de línea": "\n",
    "nuevo párrafo": "\n\n",
    "guion": "-",
    "raya": "—",
    "comillas": "\"",
    "abre paréntesis": "(",
    "cierra paréntesis": ")",
  },

  // Comandos de edición -> nombre de acción (la implementa el motor).
  editing: {
    "borra palabra": "deleteWord",
    "borrar palabra": "deleteWord",
    "borra la última palabra": "deleteWord",
    "borra oración": "deleteSentence",
    "borrar oración": "deleteSentence",
    "borra la oración": "deleteSentence",
    "borra todo": "deleteAll",
    "borrar todo": "deleteAll",
    "selecciona todo": "selectAll",
  },

  // Mayúsculas / formato de texto plano.
  casing: {
    "mayúscula": "capitalizeNext",     // capitaliza la siguiente palabra
    "minúscula": "lowercaseNext",
    "todo mayúsculas": "upperOn",
    "fin mayúsculas": "upperOff",
  },

  // Historial.
  history: {
    "deshacer": "undo",
    "rehacer": "redo",
  },

  // Formato de la hoja (negrita/cursiva/tachado/subrayado en vivo, ver
  // markdownInline.js). Cada frase inserta el marcador de Markdown y
  // se dice DOS veces, para abrir y para cerrar — igual que "comillas".
  formatting: {
    "negrita": "**",
    "cursiva": "*",
    "tachado": "~~",
    "subrayado": "++",
  },

  // Cambiar el idioma de dictado dictando (frase distintiva a propósito,
  // para no dispararse si el nombre del idioma aparece en una oración
  // normal). El valor es la clave de familia en config.js.
  languages: {
    "cambiar a inglés": "en",
    "cambiar a francés": "fr",
    "cambiar a portugués": "pt",
    "cambiar a alemán": "de",
    "cambiar a italiano": "it",
    "cambiar a chino": "zh",
    "cambiar a japonés": "ja",
  },

  // Vía de escape: "literal <palabra>" inserta la palabra tal cual.
  // Ej.: "literal punto" escribe «punto», no el signo «.».
  literalPrefix: "literal",
};
