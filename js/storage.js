// ============================================================
// storage.js
// Autoguardado local (localStorage) con debounce.
//
// Guarda el texto mientras escribís/dictás, sin servidor. Si el
// almacenamiento no está disponible (modo privado en algunos
// navegadores), degrada en silencio: la app sigue funcionando sin
// persistencia.
// ============================================================

const KEY = "speakly:document";

export class Storage {
  constructor({ key = KEY, debounceMs = 600 } = {}) {
    this.key = key;
    this.debounceMs = debounceMs;
    this._timer = null;
    this._available = this._check();
  }

  _check() {
    try {
      const probe = "__speakly_probe__";
      localStorage.setItem(probe, "1");
      localStorage.removeItem(probe);
      return true;
    } catch (_) {
      return false;
    }
  }

  get available() {
    return this._available;
  }

  load() {
    if (!this._available) return "";
    try {
      return localStorage.getItem(this.key) || "";
    } catch (_) {
      return "";
    }
  }

  save(text) {
    if (!this._available) return false;
    try {
      localStorage.setItem(this.key, text);
      return true;
    } catch (_) {
      return false;
    }
  }

  /** Guarda tras un período de calma; llama onSaved() al persistir. */
  saveDebounced(text, onSaved) {
    if (!this._available) return;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      if (this.save(text)) onSaved?.();
    }, this.debounceMs);
  }

  clear() {
    if (!this._available) return;
    try {
      localStorage.removeItem(this.key);
    } catch (_) {}
  }
}
