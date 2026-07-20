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

  // Alineado de párrafo (ver textAlign.js). A diferencia de "formatting"
  // no es apertura/cierre: se dice UNA vez al empezar el párrafo y
  // afecta solo a ese párrafo. El valor es la palabra clave que espera
  // editor.js#setParagraphAlign (que arma el marcador [center]/etc. y
  // reemplaza cualquier alineado previo del párrafo en vez de apilarlo).
  align: {
    "centrar": "center",
    "justificar": "justify",
    "alinear a la derecha": "right",
    "alinear a la izquierda": "left",
  },

  // Estilo de párrafo (ver textStyle.js y el desplegable de la barra de
  // edición). Igual que "align": se dice UNA vez, reemplaza cualquier
  // estilo previo del párrafo. "texto normal"/"quitar estilo" quitan el
  // estilo (valor "" -> editor.js#setParagraphStyle(null)).
  style: {
    "título general": "title",
    "subtítulo": "subtitle",
    "título uno": "h1",
    "título 1": "h1",
    "título dos": "h2",
    "título 2": "h2",
    "título tres": "h3",
    "título 3": "h3",
    "título cuatro": "h4",
    "título 4": "h4",
    "cita": "quote",
    "texto normal": "",
    "quitar estilo": "",
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
