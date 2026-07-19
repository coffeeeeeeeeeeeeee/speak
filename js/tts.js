// ============================================================
// tts.js
// Lee el documento en voz alta con SpeechSynthesis — la API hermana
// de SpeechRecognition, útil para releer/corregir por oído. La
// disponibilidad de voces por idioma depende del sistema/navegador,
// igual que el reconocimiento depende del servicio de Google.
//
// `onBoundary` reporta cada límite de palabra/oración que la voz va
// cruzando (evento nativo `boundary`) para que quien nos usa (app.js)
// pueda ir resaltando el texto a medida que se lee. `event.name` es
// "word" o "sentence" según lo que soporte la voz activa — algunas
// voces (sobre todo fuera de inglés) solo dan límites de oración, no
// de cada palabra; quien consume esto debe tolerar ambos casos.
// `charLength` no todos los navegadores lo mandan: puede venir 0.
// ============================================================

export function isTtsSupported() {
  return "speechSynthesis" in window;
}

export class Reader {
  constructor({ onState, onBoundary } = {}) {
    this.onState = onState || (() => {});
    this.onBoundary = onBoundary || (() => {});
  }

  speak(text, lang) {
    if (!isTtsSupported() || !text) return;
    this.stop();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.onboundary = (e) => {
      this.onBoundary({
        name: e.name || "word",
        charIndex: e.charIndex,
        charLength: e.charLength || 0,
      });
    };
    u.onend = () => this.onState("idle");
    u.onerror = () => this.onState("idle");
    this.onState("reading");
    window.speechSynthesis.speak(u);
  }

  stop() {
    if (isTtsSupported()) window.speechSynthesis.cancel();
  }

  get speaking() {
    return isTtsSupported() && window.speechSynthesis.speaking;
  }
}
