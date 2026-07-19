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
   * @param {(err:{type:string,code?:string})=>void} opts.onError  Sin texto:
   *   `type` es "permission" | "network" | otro; app.js localiza el mensaje.
   */
  constructor(opts) {
    this.opts = opts;
    this.wantsToListen = false;
    this.recognition = null;
    this._restartTimer = null;
    this._networkRetryDelay = 0; // 0 = reinicio normal; crece con errores de red seguidos
  }

  _build() {
    const rec = new SpeechRecognition();
    rec.lang = this.opts.lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      this._networkRetryDelay = 0; // el reconocedor arrancó bien: hay conexión
    };

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
          this.opts.onError?.({ type: "permission" });
          this.opts.onState?.("error");
          break;
        case "network":
          // Sin backoff, un corte de internet dispara un reinicio cada
          // ~250ms en bucle. Escalamos el retraso mientras persista y
          // avisamos solo la primera vez para no floodear de toasts.
          if (this._networkRetryDelay === 0) {
            this.opts.onError?.({ type: "network" });
          }
          this._networkRetryDelay = Math.min(
            this._networkRetryDelay ? this._networkRetryDelay * 2 : 1000,
            8000
          );
          break;
        default:
          // Sin mensaje en un idioma fijo: app.js arma el texto localizado
          // a partir de `type`/`code`, este solo aporta el detalle técnico.
          this.opts.onError?.({ type: event.error || "unknown", code: event.error });
      }
    };

    return rec;
  }

  _scheduleRestart() {
    // Pequeña pausa para no entrar en bucle si el motor aún no se reinició.
    // Si venimos de errores de red seguidos, _networkRetryDelay ya trae el
    // backoff calculado en onerror.
    clearTimeout(this._restartTimer);
    this._restartTimer = setTimeout(() => {
      if (!this.wantsToListen) return;
      try {
        this.recognition.start();
        this.opts.onState?.("listening");
      } catch (_) {
        // InvalidStateError: ya está activo. Lo ignoramos.
      }
    }, this._networkRetryDelay || 250);
  }

  start() {
    if (this.wantsToListen) return;
    this.wantsToListen = true;
    this._networkRetryDelay = 0;
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
