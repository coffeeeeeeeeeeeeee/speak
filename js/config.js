// ============================================================
// config.js
// Configuración central. Pensada para i18n: agregar un idioma
// nuevo es sumar una entrada acá y su léxico en js/commands/lang/.
// ============================================================

export const config = {
  // Idioma activo al iniciar.
  defaultLang: "es-ES",

  // Idiomas disponibles. `code` es el valor para SpeechRecognition.lang.
  // `lexicon` es el nombre del módulo en commands/lang/ (se usará en Fase 3).
  languages: {
    "es-ES": { code: "es-ES", short: "es", label: "Español", lexicon: "es" },
    // Ejemplo futuro:
    // "en-US": { code: "en-US", short: "en", label: "English", lexicon: "en" },
  },
};
