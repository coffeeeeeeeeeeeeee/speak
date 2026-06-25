// ============================================================
// recognition.js
// Envoltura sobre la Web Speech API para dictado CONTINUO.
//
// La API corta sola tras silencios o ~60s, así que mantenemos un
// flag `wantsToListen` y reiniciamos en `onend` mientras el usuario
// siga en modo escucha. Solo se emiten como "final" los resultados
// con isFinal; los interinos se emiten aparte y nunca disparan nada
// irreversible (eso lo decidirá el editor / parser).
// ============================================================

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export function isSupported() {
  return Boolean(SpeechRecognition);
}

export class SpeechController {
  /**
   * @param {Object} opts
   * @param {string} opts.lang        Código de idioma (ej. "es-ES").
   * @param {(text:string)=>void} opts.onInterim  Texto provisional (gris).
   * @param {(text:string)=>void} opts.onFinal    Texto confirmado.
   * @param {(state:string)=>void} opts.onState   "listening" | "idle" | "error".
   * @param {(err:{type:string,message:string})=>void} opts.onError
   */
  constructor(opts) {
    this.opts = opts;
    this.wantsToListen = false;
    this.recognition = null;
    this._restartTimer = null;
  }

  _build() {
    const rec = new SpeechRecognition();
    rec.lang = this.opts.lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      let interim = "";
      // Recorremos solo lo nuevo desde resultIndex.
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          this.opts.onFinal?.(transcript);
        } else {
          interim += transcript;
        }
      }
      this.opts.onInterim?.(interim);
    };

    // La API se detiene sola: si seguimos queriendo escuchar, reiniciamos.
    rec.onend = () => {
      if (this.wantsToListen) {
        this._scheduleRestart();
      } else {
        this.opts.onState?.("idle");
      }
    };

    rec.onerror = (event) => {
      switch (event.error) {
        case "no-speech":
          // Benigno: no se detectó voz. onend reiniciará.
          break;
        case "aborted":
          // Lo causamos nosotros al detener. No reiniciar.
          break;
        case "not-allowed":
        case "service-not-allowed":
          this.wantsToListen = false;
          this.opts.onError?.({
            type: "permission",
            message: "Permiso de micrófono denegado.",
          });
          this.opts.onState?.("error");
          break;
        case "network":
          this.opts.onError?.({
            type: "network",
            message: "Error de red en el reconocimiento.",
          });
          break;
        default:
          this.opts.onError?.({
            type: event.error || "unknown",
            message: "Error de reconocimiento: " + (event.error || "desconocido"),
          });
      }
    };

    return rec;
  }

  _scheduleRestart() {
    // Pequeña pausa para no entrar en bucle si el motor aún no se reinició.
    clearTimeout(this._restartTimer);
    this._restartTimer = setTimeout(() => {
      if (!this.wantsToListen) return;
      try {
        this.recognition.start();
        this.opts.onState?.("listening");
      } catch (_) {
        // InvalidStateError: ya está activo. Lo ignoramos.
      }
    }, 250);
  }

  start() {
    if (this.wantsToListen) return;
    this.wantsToListen = true;
    this.recognition = this._build();
    try {
      this.recognition.start();
      this.opts.onState?.("listening");
    } catch (_) {
      // Si lanza InvalidStateError, ya estaba activo.
    }
  }

  stop() {
    this.wantsToListen = false;
    clearTimeout(this._restartTimer);
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (_) {}
    }
    this.opts.onState?.("idle");
  }

  toggle() {
    if (this.wantsToListen) this.stop();
    else this.start();
  }

  setLang(lang) {
    this.opts.lang = lang;
    if (this.wantsToListen && this.recognition) {
      // Reiniciar con el nuevo idioma.
      this.stop();
      this.start();
    }
  }

  get listening() {
    return this.wantsToListen;
  }
}
