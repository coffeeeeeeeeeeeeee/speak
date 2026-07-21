// ============================================================
// customTheme.js
// Persistencia del tema "Personalizado": el usuario elige colores
// base (hoja/fondo/texto/acento/dictar/alerta) y acá se derivan el
// resto de las variables (ink-soft/ghost/line/accent-dim) mezclando
// esos colores con transparencia — el mismo criterio que "Alto
// contraste" aplica a mano en themes.js. Así el usuario no tiene que
// elegir 9+ colores para terminar con un tema coherente.
// ============================================================

const KEY = "bossa:customTheme";

// Los únicos colores que el usuario elige a mano en el editor de tema.
export const EDITABLE_KEYS = ["paper", "canvas", "ink", "accent", "mic", "danger"];

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function deriveColors(picks) {
  return {
    paper: picks.paper,
    canvas: picks.canvas,
    ink: picks.ink,
    "ink-soft": hexToRgba(picks.ink, 0.72),
    ghost: hexToRgba(picks.ink, 0.45),
    line: hexToRgba(picks.ink, 0.12),
    accent: picks.accent,
    "accent-dim": hexToRgba(picks.accent, 0.14),
    danger: picks.danger,
    mic: picks.mic,
  };
}

export function loadCustomTheme() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function saveCustomTheme(picks) {
  const colors = deriveColors(picks);
  try {
    localStorage.setItem(KEY, JSON.stringify(colors));
  } catch (_) {
    /* sin localStorage: el tema personalizado no se recuerda */
  }
  return colors;
}
