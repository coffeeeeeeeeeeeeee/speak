// ============================================================
// themes.js
// Registro de temas. Sumar uno nuevo es agregar una entrada acá — no
// hace falta tocar CSS: theme.js aplica `colors`/`fonts` como custom
// properties sobre <html> en tiempo de ejecución.
//
// `colors` es obligatorio y debe cubrir el set base (paper/canvas/
// ink/ink-soft/ghost/line/accent/accent-dim/danger) para que todo el
// CSS existente funcione. `accent2`/`accent3`/`mic` son opcionales:
// unos pocos elementos los usan con fallback a `accent` (ej.
// var(--mic, var(--accent))) para temas con más de un color de
// acento, como "neon", o cuando el botón "Dictar" quiere resaltar
// con un color propio en vez del acento genérico de la interfaz.
// `fonts` es opcional: si un tema no lo define, hereda la tipografía
// del primer tema del registro (el "default").
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
      mic: "#E0663B", // "Dictar" resalta aparte del acento general
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
      mic: "#F2A93B",
    },
  },

  neon: {
    label: "Neón",
    colors: {
      paper: "#150A24", // hoja: violeta casi negro, para que el celeste resalte
      canvas: "#22E6E6", // fondo detrás de la hoja: celeste llamativo
      ink: "#22E6E6", // letra: mismo celeste
      "ink-soft": "#8FDDE0",
      ghost: "#6E5B9E",
      line: "#3A2A5C",
      accent: "#FF2FD4", // magenta/fucsia
      "accent-2": "#FFE600", // amarillo: color de resaltado (dot, etc.)
      "accent-3": "#FFE600", // amarillo también acá (medidor de audio)
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
      mic: "#B0442A",
    },
    fonts: {
      serif: "Georgia, \"Times New Roman\", serif",
      mono: "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", Menlo, monospace",
    },
  },

  highContrast: {
    label: "Alto contraste",
    colors: {
      // Solo blanco y negro puros (más el acento) — nada de grises
      // intermedios, ni siquiera en los neutros secundarios.
      paper: "#FFFFFF",
      canvas: "#000000",
      ink: "#000000",
      "ink-soft": "rgba(0, 0, 0, 0.7)", // negro atenuado, no un gris aparte
      ghost: "rgba(0, 0, 0, 0.45)",
      line: "#000000",
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

  natural: {
    label: "Natural",
    colors: {
      paper: "#E7F0DC",
      canvas: "#C3D9A8",
      ink: "#16240F",
      "ink-soft": "#3E5730",
      ghost: "#7C9663",
      line: "#B3CB98",
      accent: "#2E8B3D",
      "accent-dim": "rgba(46, 139, 61, 0.18)",
      danger: "#B5482E",
      mic: "#C98A2B",
    },
  },
};
