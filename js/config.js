// ============================================================
// config.js
// Configuración central. Cada idioma es una "familia" con un léxico
// de comandos fijo (no cambia entre variantes) y una o más variantes
// regionales (`code` distinto para SpeechRecognition, mismo léxico e
// interfaz). Sumar una variante nueva es agregarla al array; sumar un
// idioma nuevo es sumar una familia con su léxico en commands/lang/.
// ============================================================

export const config = {
  // Familia + variante activas al iniciar (si no hay nada guardado).
  defaultFamily: "es",
  defaultVariant: "es-ES",

  families: {
    es: {
      label: "Español",
      lexicon: "es",
      variants: [
        { code: "es-ES", label: "España" },
        { code: "es-AR", label: "Argentina" },
        { code: "es-MX", label: "México" },
        { code: "es-US", label: "Latinoamérica (EE. UU.)" },
      ],
    },
    en: {
      label: "English",
      lexicon: "en",
      variants: [
        { code: "en-US", label: "US" },
        { code: "en-GB", label: "UK" },
        { code: "en-AU", label: "Australia" },
        { code: "en-IN", label: "India" },
      ],
    },
    fr: {
      label: "Français",
      lexicon: "fr",
      variants: [
        { code: "fr-FR", label: "France" },
        { code: "fr-CA", label: "Canada" },
      ],
    },
    pt: {
      label: "Português",
      lexicon: "pt",
      variants: [
        { code: "pt-BR", label: "Brasil" },
        { code: "pt-PT", label: "Portugal" },
      ],
    },
    de: {
      label: "Deutsch",
      lexicon: "de",
      variants: [
        { code: "de-DE", label: "Deutschland" },
        { code: "de-AT", label: "Österreich" },
        { code: "de-CH", label: "Schweiz" },
      ],
    },
    it: {
      label: "Italiano",
      lexicon: "it",
      variants: [
        { code: "it-IT", label: "Italia" },
        { code: "it-CH", label: "Svizzera" },
      ],
    },
    zh: {
      label: "中文",
      lexicon: "zh",
      // Solo simplificado/continental por ahora: zh-TW usa caracteres
      // tradicionales, que necesitarían un léxico de comandos aparte.
      variants: [{ code: "zh-CN", label: "中国大陆" }],
    },
    ja: {
      label: "日本語",
      lexicon: "ja",
      variants: [{ code: "ja-JP", label: "日本" }],
    },
  },
};
