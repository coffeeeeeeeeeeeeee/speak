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

  fr: {
    title: "speakly — dictée vocale pour écrivains",
    unsupported:
      "Votre navigateur ne prend pas en charge la reconnaissance vocale. " +
      "Utilisez Chrome ou Edge sur ordinateur pour dicter.",
    langLabel: "langue",
    langSwitchAria: "Changer la langue de dictée",
    help: "Commandes",
    copy: "Copier",
    copied: "Copié",
    copyFailed: "Échec",
    export: "Exporter",
    editorPlaceholder: "Appuyez sur « Dicter » et commencez à parler. Le texte apparaît ici.",
    editorAriaLabel: "Feuille d'écriture vocale",
    wordsLabel: "mots",
    dictate: "Dicter",
    stop: "Arrêter",
    statusListening: "à l'écoute",
    statusIdle: "en pause",
    statusError: "erreur",
    micError: "microphone",
    permissionDenied:
      "Autorisation du microphone refusée. Activez-la depuis l'icône de la " +
      "barre d'adresse et appuyez de nouveau sur « Dicter ».",
    networkError: "Pas de connexion : la reconnaissance vocale a besoin d'internet.",
    genericError: "Erreur de reconnaissance vocale.",
    savingState: "enregistrement…",
    savedState: "enregistré",
    noSaveState: "non enregistré",
    helpTitle: "Commandes vocales",
    helpIntroHtml:
      "Détectées automatiquement pendant la dictée. Pour écrire un mot-" +
      "commande tel quel, dites d'abord <strong>« littéral »</strong> " +
      "(ex. : « littéral point » écrit le mot <em>point</em>). Si une " +
      "commande se déclenche par erreur, dites <strong>« annuler »</strong> " +
      "ou utilisez Ctrl+Z. La majuscule après un point et en début de " +
      "paragraphe est automatique.",
    helpClose: "Fermer",
    helpCloseAria: "Fermer le panneau",
    toastCloseAria: "Fermer l'avis",
    helpSections: {
      punctuation: "Ponctuation",
      editing: "Édition",
      casing: "Majuscules",
      history: "Historique",
    },
    actionLabels: {
      deleteWord: "supprime le dernier mot",
      deleteSentence: "supprime la dernière phrase",
      deleteAll: "efface toute la feuille",
      selectAll: "sélectionne tout le texte",
      capitalizeNext: "majuscule au mot suivant",
      lowercaseNext: "minuscule au mot suivant",
      upperOn: "commence à écrire TOUT EN MAJUSCULES",
      upperOff: "termine le mode majuscules",
      undo: "annule la dernière action",
      redo: "rétablit ce qui a été annulé",
    },
    newParagraphLabel: "saut de paragraphe",
    newLineLabel: "saut de ligne",
  },

  pt: {
    title: "speakly — voz em texto para escritores",
    unsupported:
      "Seu navegador não é compatível com o reconhecimento de voz. Use o " +
      "Chrome ou o Edge no computador para ditar.",
    langLabel: "idioma",
    langSwitchAria: "Trocar idioma de ditado",
    help: "Comandos",
    copy: "Copiar",
    copied: "Copiado",
    copyFailed: "Não foi possível",
    export: "Exportar",
    editorPlaceholder: "Aperte «Ditar» e comece a falar. O texto aparece aqui.",
    editorAriaLabel: "Folha de escrita por voz",
    wordsLabel: "palavras",
    dictate: "Ditar",
    stop: "Parar",
    statusListening: "ouvindo",
    statusIdle: "em pausa",
    statusError: "erro",
    micError: "microfone",
    permissionDenied:
      "Permissão de microfone negada. Ative-a no ícone da barra de " +
      "endereço e aperte «Ditar» de novo.",
    networkError: "Sem conexão: o reconhecimento de voz precisa de internet.",
    genericError: "Erro de reconhecimento de voz.",
    savingState: "salvando…",
    savedState: "salvo",
    noSaveState: "não salvo",
    helpTitle: "Comandos de voz",
    helpIntroHtml:
      "Detectados automaticamente enquanto você dita. Para escrever uma " +
      "palavra-comando ao pé da letra, diga antes <strong>«literal»</strong> " +
      "(ex.: «literal ponto» escreve a palavra <em>ponto</em>). Se algo " +
      "disparar sem querer, diga <strong>«desfazer»</strong> ou use Ctrl+Z. " +
      "A maiúscula após ponto e no início de parágrafo é automática.",
    helpClose: "Fechar",
    helpCloseAria: "Fechar painel",
    toastCloseAria: "Fechar aviso",
    helpSections: {
      punctuation: "Pontuação",
      editing: "Edição",
      casing: "Maiúsculas",
      history: "Histórico",
    },
    actionLabels: {
      deleteWord: "apaga a última palavra",
      deleteSentence: "apaga a última frase",
      deleteAll: "apaga a folha inteira",
      selectAll: "seleciona todo o texto",
      capitalizeNext: "maiúscula na próxima palavra",
      lowercaseNext: "minúscula na próxima palavra",
      upperOn: "começa a escrever TUDO EM MAIÚSCULAS",
      upperOff: "termina o modo maiúsculas",
      undo: "desfaz a última ação",
      redo: "refaz o que foi desfeito",
    },
    newParagraphLabel: "quebra de parágrafo",
    newLineLabel: "quebra de linha",
  },

  de: {
    title: "speakly — Diktieren für Schreibende",
    unsupported:
      "Ihr Browser unterstützt keine Spracherkennung. Verwenden Sie Chrome " +
      "oder Edge am Computer zum Diktieren.",
    langLabel: "Sprache",
    langSwitchAria: "Diktiersprache wechseln",
    help: "Befehle",
    copy: "Kopieren",
    copied: "Kopiert",
    copyFailed: "Fehlgeschlagen",
    export: "Exportieren",
    editorPlaceholder: "Drücken Sie „Diktieren“ und beginnen Sie zu sprechen. Der Text erscheint hier.",
    editorAriaLabel: "Blatt zum Diktieren",
    wordsLabel: "Wörter",
    dictate: "Diktieren",
    stop: "Stopp",
    statusListening: "hört zu",
    statusIdle: "pausiert",
    statusError: "Fehler",
    micError: "Mikrofon",
    permissionDenied:
      "Mikrofonzugriff verweigert. Aktivieren Sie ihn über das Symbol in " +
      "der Adressleiste und drücken Sie erneut „Diktieren“.",
    networkError: "Keine Verbindung: Die Spracherkennung benötigt Internet.",
    genericError: "Fehler bei der Spracherkennung.",
    savingState: "speichert…",
    savedState: "gespeichert",
    noSaveState: "nicht gespeichert",
    helpTitle: "Sprachbefehle",
    helpIntroHtml:
      "Werden automatisch beim Diktieren erkannt. Um ein Befehlswort " +
      "wörtlich zu schreiben, sagen Sie zuerst <strong>„wörtlich“</strong> " +
      "(z. B. schreibt „wörtlich Punkt“ das Wort <em>Punkt</em>). Wenn " +
      "versehentlich ein Befehl ausgelöst wird, sagen Sie " +
      "<strong>„rückgängig“</strong> oder drücken Sie Strg+Z. Der " +
      "Großbuchstabe nach einem Punkt und am Absatzanfang ist automatisch.",
    helpClose: "Schließen",
    helpCloseAria: "Panel schließen",
    toastCloseAria: "Hinweis schließen",
    helpSections: {
      punctuation: "Zeichensetzung",
      editing: "Bearbeiten",
      casing: "Groß-/Kleinschreibung",
      history: "Verlauf",
    },
    actionLabels: {
      deleteWord: "löscht das letzte Wort",
      deleteSentence: "löscht den letzten Satz",
      deleteAll: "löscht das ganze Blatt",
      selectAll: "wählt den gesamten Text aus",
      capitalizeNext: "Großbuchstabe beim nächsten Wort",
      lowercaseNext: "Kleinbuchstabe beim nächsten Wort",
      upperOn: "beginnt ALLES IN GROSSBUCHSTABEN zu schreiben",
      upperOff: "beendet den Großschreibungsmodus",
      undo: "macht die letzte Änderung rückgängig",
      redo: "stellt das Rückgängiggemachte wieder her",
    },
    newParagraphLabel: "Absatzumbruch",
    newLineLabel: "Zeilenumbruch",
  },

  it: {
    title: "speakly — voce in testo per chi scrive",
    unsupported:
      "Il tuo browser non supporta il riconoscimento vocale. Usa Chrome o " +
      "Edge da computer per dettare.",
    langLabel: "lingua",
    langSwitchAria: "Cambia lingua di dettatura",
    help: "Comandi",
    copy: "Copia",
    copied: "Copiato",
    copyFailed: "Non riuscito",
    export: "Esporta",
    editorPlaceholder: "Premi «Detta» e inizia a parlare. Il testo appare qui.",
    editorAriaLabel: "Foglio di scrittura vocale",
    wordsLabel: "parole",
    dictate: "Detta",
    stop: "Ferma",
    statusListening: "in ascolto",
    statusIdle: "in pausa",
    statusError: "errore",
    micError: "microfono",
    permissionDenied:
      "Permesso del microfono negato. Attivalo dall'icona nella barra " +
      "degli indirizzi e premi di nuovo «Detta».",
    networkError: "Nessuna connessione: il riconoscimento vocale richiede internet.",
    genericError: "Errore di riconoscimento vocale.",
    savingState: "salvataggio…",
    savedState: "salvato",
    noSaveState: "non salvato",
    helpTitle: "Comandi vocali",
    helpIntroHtml:
      "Rilevati automaticamente mentre detti. Per scrivere una parola-" +
      "comando così com'è, di' prima <strong>«letterale»</strong> (es.: " +
      "«letterale punto» scrive la parola <em>punto</em>). Se un comando " +
      "si attiva per errore, di' <strong>«annulla»</strong> oppure usa " +
      "Ctrl+Z. La maiuscola dopo un punto e all'inizio di un paragrafo è " +
      "automatica.",
    helpClose: "Chiudi",
    helpCloseAria: "Chiudi pannello",
    toastCloseAria: "Chiudi avviso",
    helpSections: {
      punctuation: "Punteggiatura",
      editing: "Modifica",
      casing: "Maiuscole",
      history: "Cronologia",
    },
    actionLabels: {
      deleteWord: "cancella l'ultima parola",
      deleteSentence: "cancella l'ultima frase",
      deleteAll: "cancella tutto il foglio",
      selectAll: "seleziona tutto il testo",
      capitalizeNext: "maiuscola alla prossima parola",
      lowercaseNext: "minuscola alla prossima parola",
      upperOn: "inizia a scrivere TUTTO MAIUSCOLO",
      upperOff: "termina la modalità maiuscolo",
      undo: "annulla l'ultima modifica",
      redo: "ripristina ciò che è stato annullato",
    },
    newParagraphLabel: "interruzione di paragrafo",
    newLineLabel: "interruzione di riga",
  },
};
