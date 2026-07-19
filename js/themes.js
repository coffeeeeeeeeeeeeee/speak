// ============================================================
// themes.js
// Registro de temas. Sumar uno nuevo es agregar una entrada acá — no
// hace falta tocar CSS: theme.js aplica `colors`/`fonts` como custom
// properties sobre <html> en tiempo de ejecución.
//
// `colors` es obligatorio y debe cubrir el set base (paper/canvas/
// ink/ink-soft/ghost/line/accent/accent-dim/danger) para que todo el
// CSS existente funcione. `accent2`/`accent3` son opcionales: unos
// pocos elementos los usan con fallback a `accent` (var(--accent-2,
// var(--accent))) para temas con más de un color de acento, como
// "neon". `fonts` es opcional: si un tema no lo define, hereda la
// tipografía del primer tema del registro (el "default").
// ============================================================

export const themes = {
  light: {
    label: "Claro",
    colors: {
      paper: "#F2F3F0",
      canvas: "#DBDCD7",
      ink: "#1B1C1E",
      "ink-soft": "#5A5C5E",
      ghost: "#A8AAA4",
      line: "#E2E3DF",
      accent: "#3A5BDB",
      "accent-dim": "rgba(58, 91, 219, 0.12)",
      danger: "#B23A3A",
    },
    fonts: {
      serif: "\"Newsreader\", Georgia, \"Times New Roman\", serif",
      mono: "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", Menlo, monospace",
    },
  },

  dark: {
    label: "Oscuro",
    colors: {
      paper: "#242524",
      canvas: "#141514",
      ink: "#ECEDE9",
      "ink-soft": "#A6A8A2",
      ghost: "#6B6D67",
      line: "#35362F",
      accent: "#6C8CFF",
      "accent-dim": "rgba(108, 140, 255, 0.18)",
      danger: "#E2726F",
    },
  },

  neon: {
    label: "Neón",
    colors: {
      paper: "#150A24",
      canvas: "#08040F",
      ink: "#F7F3FF",
      "ink-soft": "#B9A8E0",
      ghost: "#6E5B9E",
      line: "#3A2A5C",
      accent: "#FF2FD4", // fucsia
      "accent-2": "#22E6E6", // celeste
      "accent-3": "#FFE600", // amarillo
      "accent-dim": "rgba(255, 47, 212, 0.18)",
      danger: "#FF4D6D",
    },
    fonts: {
      // Todo en mono, con look de terminal — ver "no contornos" en
      // main.css: acá la personalidad tipográfica hace ese trabajo.
      serif: "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", Menlo, monospace",
      mono: "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", Menlo, monospace",
    },
  },

  sepia: {
    label: "Sepia",
    colors: {
      paper: "#F4ECD8",
      canvas: "#E4D8BC",
      ink: "#3B2F22",
      "ink-soft": "#6B5C48",
      ghost: "#A8977C",
      line: "#DCCBA6",
      accent: "#A85C2A",
      "accent-dim": "rgba(168, 92, 42, 0.14)",
      danger: "#A23B2E",
    },
    fonts: {
      serif: "Georgia, \"Times New Roman\", serif",
      mono: "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", Menlo, monospace",
    },
  },

  highContrast: {
    label: "Alto contraste",
    colors: {
      paper: "#FFFFFF",
      canvas: "#E5E5E5",
      ink: "#000000",
      "ink-soft": "#1A1A1A",
      ghost: "#555555",
      line: "#CCCCCC",
      accent: "#0000EE",
      "accent-dim": "rgba(0, 0, 238, 0.15)",
      danger: "#D40000",
    },
    fonts: {
      // Sans del sistema: para accesibilidad suele legibilizar más
      // que una serif en textos largos.
      serif: "-apple-system, \"Segoe UI\", Roboto, Arial, sans-serif",
      mono: "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", Menlo, monospace",
    },
  },

  forest: {
    label: "Bosque",
    colors: {
      paper: "#EDF1E7",
      canvas: "#DCE3D3",
      ink: "#23301F",
      "ink-soft": "#52604A",
      ghost: "#94A187",
      line: "#CBD6BE",
      accent: "#3E7A4B",
      "accent-dim": "rgba(62, 122, 75, 0.14)",
      danger: "#B5482E",
    },
  },
};
