// ============================================================
// theme.js
// Aplica un tema del registro (themes.js) como custom properties
// sobre <html> y cicla entre todos. Sumar un tema nuevo: agregarlo a
// themes.js — aparece solo en el ciclo, no hace falta tocar este
// archivo.
//
// Sin elección explícita, sigue la preferencia de color del sistema
// (solo entre "light"/"dark", que son los dos con esa contraparte
// clara). El valor elegido se persiste y se re-aplica antes del
// primer pintado — ver el script inline en <head> de index.html, que
// evita el parpadeo aplicando un adelanto de paper/ink mientras este
// módulo carga.
// ============================================================

import { themes } from "./themes.js";

const KEY = "speakly:theme";
const ORDER = Object.keys(themes);
const DEFAULT_ID = ORDER[0];

// Unión de todas las claves que define CUALQUIER tema (ej. "neon" trae
// accent-2/accent-3 que otros temas no tienen). Al aplicar un tema hay
// que barrer también las que NO trae, si no quedan pegadas las del
// tema anterior — setProperty no borra lo que no menciona.
function allKeys(field) {
  const keys = new Set();
  for (const theme of Object.values(themes)) {
    for (const key of Object.keys(theme[field] || {})) keys.add(key);
  }
  return keys;
}
const ALL_COLOR_KEYS = allKeys("colors");
const ALL_FONT_KEYS = allKeys("fonts");

function systemPrefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function applyVars(id) {
  const theme = themes[id] || themes[DEFAULT_ID];
  const root = document.documentElement.style;

  for (const key of ALL_COLOR_KEYS) {
    if (key in theme.colors) root.setProperty(`--${key}`, theme.colors[key]);
    else root.removeProperty(`--${key}`);
  }

  // Si el tema no define tipografía, hereda la del tema default —
  // así no queda una fuente de un tema anterior pisando al actual.
  const fonts = { ...(themes[DEFAULT_ID].fonts || {}), ...(theme.fonts || {}) };
  for (const key of ALL_FONT_KEYS) {
    if (key in fonts) root.setProperty(`--${key}`, fonts[key]);
    else root.removeProperty(`--${key}`);
  }
}

export function currentTheme() {
  const saved = document.documentElement.dataset.theme;
  if (saved && themes[saved]) return saved;
  return systemPrefersDark() ? "dark" : DEFAULT_ID;
}

export function setTheme(id) {
  if (!themes[id]) return;
  document.documentElement.dataset.theme = id;
  applyVars(id);
  try {
    localStorage.setItem(KEY, id);
  } catch (_) {
    /* sin localStorage: el tema simplemente no se recuerda */
  }
}

export function themeLabel(id) {
  return themes[id]?.label ?? id;
}

// Aplica ahora mismo el tema activo (guardado o el que ya haya
// dejado data-theme el script inline de <head>). app.js lo llama al
// arrancar, antes de leer currentTheme() para pintar el botón.
applyVars(currentTheme());
