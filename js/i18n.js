// ============================================================
// i18n.js
// Textos de interfaz por idioma (lo que se VE en pantalla). El léxico
// de comandos de voz vive aparte, en commands/lang/*.js — son dos
// cosas distintas: acá va la traducción de la UI.
//
// `helpIntroHtml` es el único campo con marcado (negrita/cursiva en
// el intro del panel de comandos); el resto es texto plano.
// ============================================================

export const strings = {
  es: {
    title: "speakly — voz a texto para escritores",
    unsupported:
      "Tu navegador no soporta el reconocimiento de voz. Usá Chrome o Edge de escritorio para dictar.",
    langLabel: "idioma",
    langSwitchAria: "Cambiar idioma de dictado",
    help: "Comandos",
    copy: "Copiar",
    copied: "Copiado",
    copyFailed: "No se pudo",
    export: "Exportar",
    editorPlaceholder: "Pulsá «Dictar» y empezá a hablar. El texto aparece acá.",
    editorAriaLabel: "Hoja de escritura por voz",
    wordsLabel: "palabras",
    dictate: "Dictar",
    stop: "Detener",
    statusListening: "escuchando",
    statusIdle: "en pausa",
    statusError: "error",
    micError: "micrófono",
    permissionDenied:
      "Permiso de micrófono denegado. Activalo en el ícono de la barra de direcciones y volvé a pulsar «Dictar».",
    networkError: "Sin conexión: el reconocimiento necesita internet.",
    genericError: "Error de reconocimiento.",
    savingState: "guardando…",
    savedState: "guardado",
    noSaveState: "sin guardado",
    helpTitle: "Comandos de voz",
    helpIntroHtml:
      "Se detectan automáticamente mientras dictás. Para escribir una " +
      "palabra-comando tal cual, antepené <strong>«literal»</strong> " +
      "(ej.: «literal punto» escribe la palabra <em>punto</em>). Si algo se " +
      "dispara sin querer, decí <strong>«deshacer»</strong> o usá Ctrl+Z. " +
      "La mayúscula tras punto y al inicio de párrafo es automática.",
    helpClose: "Cerrar",
    helpCloseAria: "Cerrar panel",
    toastCloseAria: "Cerrar aviso",
    helpSections: {
      punctuation: "Puntuación",
      editing: "Edición",
      casing: "Mayúsculas",
      history: "Historial",
    },
    actionLabels: {
      deleteWord: "borra la última palabra",
      deleteSentence: "borra la última oración",
      deleteAll: "borra toda la hoja",
      selectAll: "selecciona todo el texto",
      capitalizeNext: "mayúscula en la siguiente palabra",
      lowercaseNext: "minúscula en la siguiente palabra",
      upperOn: "empieza a escribir TODO EN MAYÚSCULAS",
      upperOff: "termina el modo mayúsculas",
      undo: "deshace lo último",
      redo: "rehace lo deshecho",
    },
    newParagraphLabel: "salto de párrafo",
    newLineLabel: "salto de línea",
  },

  en: {
    title: "speakly — voice to text for writers",
    unsupported:
      "Your browser doesn't support speech recognition. Use desktop Chrome or Edge to dictate.",
    langLabel: "language",
    langSwitchAria: "Switch dictation language",
    help: "Commands",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Couldn't copy",
    export: "Export",
    editorPlaceholder: "Press “Dictate” and start talking. Your text shows up here.",
    editorAriaLabel: "Voice writing sheet",
    wordsLabel: "words",
    dictate: "Dictate",
    stop: "Stop",
    statusListening: "listening",
    statusIdle: "paused",
    statusError: "error",
    micError: "microphone",
    permissionDenied:
      "Microphone permission denied. Enable it from the address bar icon and press “Dictate” again.",
    networkError: "No connection: speech recognition needs internet.",
    genericError: "Speech recognition error.",
    savingState: "saving…",
    savedState: "saved",
    noSaveState: "not saved",
    helpTitle: "Voice commands",
    helpIntroHtml:
      "Detected automatically while you dictate. To type a command word " +
      "as-is, say <strong>«literal»</strong> first (e.g. “literal period” " +
      "types the word <em>period</em>). If something triggers by accident, " +
      "say <strong>«undo»</strong> or press Ctrl+Z. The capital letter " +
      "after a period and at the start of a paragraph is automatic.",
    helpClose: "Close",
    helpCloseAria: "Close panel",
    toastCloseAria: "Close notice",
    helpSections: {
      punctuation: "Punctuation",
      editing: "Editing",
      casing: "Casing",
      history: "History",
    },
    actionLabels: {
      deleteWord: "deletes the last word",
      deleteSentence: "deletes the last sentence",
      deleteAll: "clears the whole sheet",
      selectAll: "selects all the text",
      capitalizeNext: "capitalizes the next word",
      lowercaseNext: "lowercases the next word",
      upperOn: "starts writing IN ALL CAPS",
      upperOff: "ends all-caps mode",
      undo: "undoes the last change",
      redo: "redoes what was undone",
    },
    newParagraphLabel: "paragraph break",
    newLineLabel: "line break",
  },
};
