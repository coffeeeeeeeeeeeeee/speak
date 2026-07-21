// ============================================================
// tts.js
// Lee el documento en voz alta con SpeechSynthesis — la API hermana
// de SpeechRecognition, útil para releer/corregir por oído. La
// disponibilidad de voces por idioma depende del sistema/navegador,
// igual que el reconocimiento depende del servicio de Google.
//
// `onBoundary` va marcando qué palabra se está leyendo para que quien
// nos usa (app.js) resalte el texto a medida que avanza. NO usamos el
// evento nativo `boundary` de SpeechSynthesis para esto: además de
// venir con soporte disparejo por voz/navegador (algunas solo marcan
// límites de oración, no de cada palabra), en Chrome/Chromium sobre
// Linux directamente no llega nunca. En su lugar simulamos el avance
// con un temporizador, estimando cuánto tarda cada palabra según su
// longitud y la velocidad de la voz — menos preciso que un evento
// real, pero funciona igual en cualquier navegador/voz/sistema.
// ============================================================

export function isTtsSupported() {
  return "speechSynthesis" in window;
}

// Palabras por segundo a velocidad normal (rate=1): estimación gruesa
// de una lectura en voz alta pausada, no una medida exacta de ninguna
// voz en particular.
const CHARS_PER_SECOND = 14;

export class Reader {
  constructor({ onState, onBoundary } = {}) {
    this.onState = onState || (() => {});
    this.onBoundary = onBoundary || (() => {});
    this._timer = null;
  }

  speak(text, lang) {
    if (!isTtsSupported() || !text) return;
    this.stop();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.onstart = () => this._simulateBoundaries(text, u.rate || 1);
    u.onend = () => {
      this._clearTimer();
      this.onState("idle");
    };
    u.onerror = () => {
      this._clearTimer();
      this.onState("idle");
    };
    this.onState("reading");
    window.speechSynthesis.speak(u);
  }

  // Encadena un setTimeout por palabra en vez de un solo setInterval:
  // así el retraso de cada paso depende de la palabra QUE ACABA de
  // marcarse (más larga, más tiempo hasta la próxima), no de un tic
  // fijo que perdería sincronía con palabras cortas o largas.
  _simulateBoundaries(text, rate) {
    const words = [...text.matchAll(/\S+/g)];
    if (!words.length) return;
    const charsPerSecond = CHARS_PER_SECOND * rate;
    let i = 0;
    const step = () => {
      if (i >= words.length) return;
      const w = words[i];
      this.onBoundary({ charIndex: w.index, charLength: w[0].length });
      const seconds = Math.max(0.12, w[0].length / charsPerSecond);
      i++;
      this._timer = setTimeout(step, seconds * 1000);
    };
    step();
  }

  _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  stop() {
    this._clearTimer();
    if (isTtsSupported()) window.speechSynthesis.cancel();
  }

  get speaking() {
    return isTtsSupported() && window.speechSynthesis.speaking;
  }
}
