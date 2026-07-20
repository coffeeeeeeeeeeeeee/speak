// ============================================================
// config.js
// Configuración central. Cada idioma es una "familia" con un léxico
// de comandos fijo (no cambia entre variantes) y una o más variantes
// regionales (`code` distinto para SpeechRecognition, mismo léxico e
// interfaz). Sumar una variante nueva es agregarla al array; sumar un
// idioma nuevo es sumar una familia con su léxico en commands/lang/.
//
// `labelEn` (familia y variante) es el nombre en inglés, usado SOLO
// como `title` (tooltip) en el desplegable de idioma: para quien no
// lee el alfabeto/script de un idioma (ej. 中文 vs 日本語), el nombre
// en su propio idioma no ayuda a identificarlo.
// ============================================================

export const config = {
  // Familia + variante activas al iniciar (si no hay nada guardado).
  defaultFamily: "es",
  defaultVariant: "es-ES",

  families: {
    es: {
      label: "Español",
      labelEn: "Spanish",
      lexicon: "es",
      variants: [
        { code: "es-ES", label: "España", labelEn: "Spain" },
        { code: "es-AR", label: "Argentina", labelEn: "Argentina" },
        { code: "es-MX", label: "México", labelEn: "Mexico" },
        { code: "es-US", label: "Latinoamérica (EE. UU.)", labelEn: "Latin America (US)" },
      ],
    },
    en: {
      label: "English",
      labelEn: "English",
      lexicon: "en",
      variants: [
        { code: "en-US", label: "US", labelEn: "United States" },
        { code: "en-GB", label: "UK", labelEn: "United Kingdom" },
        { code: "en-AU", label: "Australia", labelEn: "Australia" },
        { code: "en-IN", label: "India", labelEn: "India" },
      ],
    },
    fr: {
      label: "Français",
      labelEn: "French",
      lexicon: "fr",
      variants: [
        { code: "fr-FR", label: "France", labelEn: "France" },
        { code: "fr-CA", label: "Canada", labelEn: "Canada" },
      ],
    },
    pt: {
      label: "Português",
      labelEn: "Portuguese",
      lexicon: "pt",
      variants: [
        { code: "pt-BR", label: "Brasil", labelEn: "Brazil" },
        { code: "pt-PT", label: "Portugal", labelEn: "Portugal" },
      ],
    },
    de: {
      label: "Deutsch",
      labelEn: "German",
      lexicon: "de",
      variants: [
        { code: "de-DE", label: "Deutschland", labelEn: "Germany" },
        { code: "de-AT", label: "Österreich", labelEn: "Austria" },
        { code: "de-CH", label: "Schweiz", labelEn: "Switzerland" },
      ],
    },
    it: {
      label: "Italiano",
      labelEn: "Italian",
      lexicon: "it",
      variants: [
        { code: "it-IT", label: "Italia", labelEn: "Italy" },
        { code: "it-CH", label: "Svizzera", labelEn: "Switzerland" },
      ],
    },
    zh: {
      label: "中文",
      labelEn: "Chinese",
      lexicon: "zh",
      // Solo simplificado/continental por ahora: zh-TW usa caracteres
      // tradicionales, que necesitarían un léxico de comandos aparte.
      variants: [{ code: "zh-CN", label: "中国大陆", labelEn: "Mainland China" }],
    },
    ja: {
      label: "日本語",
      labelEn: "Japanese",
      lexicon: "ja",
      variants: [{ code: "ja-JP", label: "日本", labelEn: "Japan" }],
    },
  },
};
