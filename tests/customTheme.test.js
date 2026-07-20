import { test, assertEqual, assertTrue } from "./tiny-test.js";
import { EDITABLE_KEYS, deriveColors, saveCustomTheme, loadCustomTheme } from "../js/customTheme.js";

test("deriveColors: copia los colores elegidos tal cual", () => {
  const colors = deriveColors({
    paper: "#FFFFFF",
    canvas: "#EEEEEE",
    ink: "#111111",
    accent: "#3355FF",
    mic: "#FF7700",
    danger: "#CC0000",
  });
  assertEqual(colors.paper, "#FFFFFF");
  assertEqual(colors.canvas, "#EEEEEE");
  assertEqual(colors.ink, "#111111");
  assertEqual(colors.accent, "#3355FF");
  assertEqual(colors.mic, "#FF7700");
  assertEqual(colors.danger, "#CC0000");
});

test("deriveColors: deriva ink-soft/ghost/line/accent-dim como rgba mezclado", () => {
  const colors = deriveColors({
    paper: "#FFFFFF",
    canvas: "#EEEEEE",
    ink: "#101B4D",
    accent: "#FF2FD4",
    mic: "#FF7700",
    danger: "#CC0000",
  });
  assertEqual(colors["ink-soft"], "rgba(16, 27, 77, 0.72)");
  assertEqual(colors["ghost"], "rgba(16, 27, 77, 0.45)");
  assertEqual(colors["line"], "rgba(16, 27, 77, 0.12)");
  assertEqual(colors["accent-dim"], "rgba(255, 47, 212, 0.14)");
});

test("EDITABLE_KEYS: son exactamente los seis colores que elige el usuario", () => {
  assertEqual(EDITABLE_KEYS, ["paper", "canvas", "ink", "accent", "mic", "danger"]);
});

test("saveCustomTheme/loadCustomTheme: guarda y relee del localStorage", () => {
  localStorage.removeItem("speakly:customTheme");
  assertEqual(loadCustomTheme(), null);
  const saved = saveCustomTheme({
    paper: "#FFFFFF",
    canvas: "#EEEEEE",
    ink: "#111111",
    accent: "#3355FF",
    mic: "#FF7700",
    danger: "#CC0000",
  });
  const reloaded = loadCustomTheme();
  assertTrue(reloaded !== null, "debería haber quedado guardado");
  assertEqual(reloaded, saved);
  assertEqual(reloaded.paper, "#FFFFFF");
  localStorage.removeItem("speakly:customTheme");
});
