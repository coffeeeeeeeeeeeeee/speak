// ============================================================
// tts.js
// Lee el documento en voz alta con SpeechSynthesis — la API hermana
// de SpeechRecognition, útil para releer/corregir por oído. La
// disponibilidad de voces por idioma depende del sistema/navegador,
// igual que el reconocimiento depende del servicio de Google.
//
// `onBoundary` va marcando qué palabra se está leyendo para que quien
// nos usa (app.js) resalte el texto a medida que avanza. Preferimos el
// evento nativo `boundary` de SpeechSynthesis cuando el navegador/voz
// lo dispara de verdad (ahí la sincronía es exacta), pero no podemos
// depender solo de él: el soporte es disparejo por voz/navegador
// (algunas solo marcan límites de oración, no de cada palabra) y en
// Chrome/Chromium sobre Linux directamente no llega nunca. Si no
// aparece ningún evento real al arrancar, simulamos el avance con un
// temporizador propio, estimando cuánto tarda cada palabra según su
// longitud (con una pausa extra tras signos de puntuación, para no
// perder sincronía en textos largos) y la velocidad de la voz.
// ============================================================

export function isTtsSupported() {
  return "speechSynthesis" in window;
}

// Lista de voces instaladas (varía por sistema/navegador). Puede venir
// vacía la primera vez que se llama: en varios navegadores se cargan
// de forma asincrónica, recién disponibles tras el evento
// `voiceschanged` — quien la usa (app.js) debe escuchar ese evento y
// volver a pedirla.
export function getVoices() {
  return isTtsSupported() ? window.speechSynthesis.getVoices() : [];
}

// Caracteres por segundo a velocidad normal (rate=1): estimación
// gruesa de una lectura en voz alta pausada, no una medida exacta de
// ninguna voz en particular.
const CHARS_PER_SECOND = 14;

// Pausa extra (segundos) tras una palabra que termina en signo de
// puntuación fuerte/débil — sin esto, la simulación va acumulando
// atraso frente al audio real a medida que el texto tiene más comas y
// puntos (cada uno es una micro-pausa real que la sola cuenta de
// caracteres no ve).
const PAUSE_STRONG = 0.35; // . ! ? … y sus variantes con comillas/paréntesis
const PAUSE_SOFT = 0.15; // , ; :

// Cuánto esperar desde que arranca la utterance antes de asumir que
// el navegador NO va a mandar el evento `boundary` real (en los que sí
// lo mandan, el primero llega casi de inmediato).
const REAL_BOUNDARY_GRACE_MS = 300;

export class Reader {
  constructor({ onState, onBoundary } = {}) {
    this.onState = onState || (() => {});
    this.onBoundary = onBoundary || (() => {});
    this._timer = null;
    this.voiceURI = null; // null = voz por defecto del navegador para `lang`
  }

  // `voice` es un SpeechSynthesisVoice de getVoices(), o null para
  // volver a la voz por defecto del sistema para el idioma leído. Se
  // guarda solo su identificador (voiceURI), no el objeto en sí: si el
  // navegador vuelve a poblar la lista de voces entre que se elige acá
  // y que se llama a speak() (pasa seguido — getVoices() se recarga
  // sola, sobre todo la primera vez tras el evento `voiceschanged`),
  // ese objeto SpeechSynthesisVoice queda "viejo" y Chrome directamente
  // no dice nada al pedirle leer con él: cancela en silencio, sin
  // disparar ni onstart ni onerror, así que ni la lectura ni el error
  // se notaban. Buscar el voiceURI en getVoices() recién al hablar
  // evita depender de esa referencia guardada.
  setVoice(voice) {
    this.voiceURI = voice ? voice.voiceURI : null;
  }

  speak(text, lang) {
    if (!isTtsSupported() || !text) return;
    this.stop();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    if (this.voiceURI) {
      const voice = getVoices().find((v) => v.voiceURI === this.voiceURI);
      // Si la voz elegida ya no existe (lista recargada, dispositivo
      // distinto), sigue con la voz por defecto de `lang` en vez de
      // quedarse muda.
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang;
      }
    }

    let realBoundarySeen = false;
    u.onboundary = (e) => {
      realBoundarySeen = true;
      this._clearTimer(); // si había arrancado la simulación, se descarta
      if (e.charIndex == null) return;
      this.onBoundary({ charIndex: e.charIndex, charLength: e.charLength || 0 });
    };
    u.onstart = () => {
      this._timer = setTimeout(() => {
        if (!realBoundarySeen) this._simulateBoundaries(text, u.rate || 1);
      }, REAL_BOUNDARY_GRACE_MS);
    };
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
  // marcarse (más larga, o seguida de puntuación, más tiempo hasta la
  // próxima), no de un tic fijo que perdería sincronía enseguida.
  _simulateBoundaries(text, rate) {
    const words = [...text.matchAll(/\S+/g)];
    if (!words.length) return;
    const charsPerSecond = CHARS_PER_SECOND * rate;
    let i = 0;
    const step = () => {
      if (i >= words.length) return;
      const w = words[i];
      this.onBoundary({ charIndex: w.index, charLength: w[0].length });
      const seconds = Math.max(0.12, w[0].length / charsPerSecond) + pauseAfter(w[0]) / rate;
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

function pauseAfter(word) {
  if (/[.!?…]["')\]]*$/.test(word)) return PAUSE_STRONG;
  if (/[,;:]["')\]]*$/.test(word)) return PAUSE_SOFT;
  return 0;
}
