// ============================================================
// tts.js
// Lee el documento en voz alta con SpeechSynthesis — la API hermana
// de SpeechRecognition, útil para releer/corregir por oído. La
// disponibilidad de voces por idioma depende del sistema/navegador,
// igual que el reconocimiento depende del servicio de Google.
// ============================================================

export function isTtsSupported() {
  return "speechSynthesis" in window;
}

export class Reader {
  constructor({ onState } = {}) {
    this.onState = onState || (() => {});
  }

  speak(text, lang) {
    if (!isTtsSupported() || !text) return;
    this.stop();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
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
