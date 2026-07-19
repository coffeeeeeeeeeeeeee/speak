// ============================================================
// config.js
// Configuración central. Pensada para i18n: agregar un idioma
// nuevo es sumar una entrada acá y su léxico en js/commands/lang/.
// ============================================================

export const config = {
  // Idioma activo al iniciar (si no hay uno guardado de una sesión anterior).
  defaultLang: "es-ES",

  // Idiomas disponibles. `code` es el valor para SpeechRecognition.lang.
  // `lexicon` es el nombre del módulo en commands/lang/ y también la clave
  // de sus textos de interfaz en i18n.js (misma clave para ambos).
  languages: {
    "es-ES": { code: "es-ES", short: "es", label: "Español", lexicon: "es" },
    "en-US": { code: "en-US", short: "en", label: "English", lexicon: "en" },
  },
};
