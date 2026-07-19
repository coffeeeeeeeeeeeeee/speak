// ============================================================
// theme.js
// Alterna claro/oscuro. Sin elección explícita, sigue la preferencia
// del sistema (@media prefers-color-scheme en main.css); al tocar el
// botón se fija un data-theme en <html> que manda por encima de eso,
// y se persiste en localStorage. El valor guardado ya se aplica antes
// de este módulo — ver el script inline en <head> de index.html, que
// evita el parpadeo aplicándolo antes del primer pintado.
// ============================================================

const KEY = "speakly:theme";

function systemPrefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function currentTheme() {
  const explicit = document.documentElement.dataset.theme;
  return explicit === "light" || explicit === "dark"
    ? explicit
    : systemPrefersDark()
    ? "dark"
    : "light";
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch (_) {
    /* sin localStorage: el tema simplemente no se recuerda */
  }
}

export function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}
