// ============================================================
// themes.js
// Registro de temas. Sumar uno nuevo es agregar una entrada acá — no
// hace falta tocar CSS: theme.js aplica `colors`/`fonts` como custom
// properties sobre <html> en tiempo de ejecución.
//
// `colors` es obligatorio y debe cubrir el set base (paper/canvas/
// ink/ink-soft/ghost/line/accent/accent-dim/danger) para que todo el
// CSS existente funcione. El resto son opcionales, con fallback a los
// colores base (ej. var(--mic, var(--accent))):
//   - accent2/accent3: para temas con más de un color de acento (ej.
//     "neon"), o el color de "resaltado" (dot al escuchar, medidor
//     de audio, y el botón Dictar mientras escucha si no define
//     mic-active).
//   - mic: color propio del botón "Dictar" en reposo, distinto del
//     acento genérico de la interfaz.
//   - mic-ink: color del ícono de "Dictar" en reposo (flota con relleno
//     a pleno de "mic"/accent), cuando ese color es muy claro y el
//     blanco por defecto no alcanzaría de contraste (ej. "matrix").
//   - mic-active: color de "Dictar" mientras escucha, si un tema
//     quiere que sea DISTINTO del resaltado general (accent2) — ej.
//     "neon" deja el amarillo exclusivo de Dictar y usa cian en todo
//     lo demás que antes compartía ese resaltado.
//   - mic-active-ink: color del ícono de "Dictar" mientras escucha,
//     cuando mic-active (o accent2, sin mic-active) es muy claro y el
//     blanco por defecto no alcanzaría de contraste.
//   - bar/bar-ink/bar-btn/bar-btn-hover/bar-btn-ink: para temas donde
//     la barra superior e inferior necesitan un color propio distinto
//     de la hoja (fondo/texto/fondo-de-botón/hover-de-botón/ícono-de-
//     botón), en vez de heredar paper/ink/transparente/ink como el
//     resto de los temas.
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
      paper: "#FFFFFF", // hoja: blanca
      canvas: "#101B4D", // fondo detrás de la hoja: azul oscuro
      ink: "#101B4D", // letra de la hoja: mismo azul oscuro que el fondo
      "ink-soft": "#4A5590",
      ghost: "#9AA3D6",
      line: "#E4E7F5",
      accent: "#FF2FD4", // magenta/fucsia
      "accent-2": "#00E5FF", // cian: color de resaltado general (punto de estado, etc.)
      "accent-3": "#00E5FF", // cian también acá (medidor de audio)
      "accent-dim": "rgba(255, 47, 212, 0.18)",
      danger: "#FF4D6D",
      bar: "#FF2FD4", // barras (topbar/hud): magenta pleno
      "bar-ink": "#FFFFFF", // texto de las barras (ej. "Bossa Studio", contador): blanco
      "bar-btn": "#00E5FF", // fondo de los botones: cian
      "bar-btn-hover": "#66F2FF", // variante clara para el hover
      "bar-btn-ink": "#101B4D", // ícono de los botones: mismo azul oscuro que la letra de la hoja (--ink)
      // El amarillo queda EXCLUSIVO del botón "Dictar" mientras escucha
      // (--mic-active): en vez de compartir el resaltado general
      // (--accent-2, cian acá), así "encendido" solo tiene un color en
      // toda la interfaz.
      "mic-active": "#FFE600",
      "mic-active-ink": "#101B4D", // ícono oscuro sobre el amarillo pleno al escuchar
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
    label: "Naturaleza",
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

  matrix: {
    label: "Matrix",
    colors: {
      paper: "#0B0F0C", // hoja: casi negro, no negro puro (deja ver la textura del papel)
      canvas: "#040604",
      ink: "#00FF66", // verde brillante clásico
      "ink-soft": "#00B84B",
      ghost: "#046B29",
      line: "#0E2A16",
      accent: "#00FF66",
      "accent-dim": "rgba(0, 255, 102, 0.16)",
      danger: "#FF3B3B",
      mic: "#39FF7A",
      "mic-ink": "#04140A", // el blanco no alcanza de contraste sobre este verde brillante
    },
    fonts: {
      // Mono también en la serif: el look "terminal" es el punto del tema.
      serif: "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", Menlo, monospace",
      mono: "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", Menlo, monospace",
    },
  },
};
