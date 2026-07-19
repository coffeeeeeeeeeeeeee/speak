// ============================================================
// audioMeter.js
// Medidor de nivel de audio del micrófono, independiente del
// reconocimiento de voz: SpeechRecognition no expone el stream ni
// ningún parámetro de audio (ni ganancia, ni cancelación de eco, ni
// el dispositivo elegido), así que esto usa getUserMedia + Web Audio
// por su cuenta, solo para dar una señal visual de que el micrófono
// está captando algo. No afecta al reconocimiento en absoluto.
// ============================================================

export class AudioMeter {
  constructor({ onLevel } = {}) {
    this.onLevel = onLevel || (() => {});
    this.stream = null;
    this.audioCtx = null;
    this.analyser = null;
    this.data = null;
    this.rafId = null;
    this._tick = this._tick.bind(this);
  }

  async start() {
    if (this.stream) return true;
    if (!navigator.mediaDevices?.getUserMedia) return false;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (_) {
      return false; // permiso denegado, sin micrófono, etc. — degrada en silencio
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new Ctx();
    const source = this.audioCtx.createMediaStreamSource(this.stream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.6;
    source.connect(this.analyser);
    this.data = new Uint8Array(this.analyser.frequencyBinCount);
    this._tick();
    return true;
  }

  _tick() {
    if (!this.analyser) return;
    this.analyser.getByteTimeDomainData(this.data);
    // RMS de la forma de onda (centrada en 128) -> nivel 0..1.
    let sumSquares = 0;
    for (let i = 0; i < this.data.length; i++) {
      const v = (this.data[i] - 128) / 128;
      sumSquares += v * v;
    }
    const rms = Math.sqrt(sumSquares / this.data.length);
    // *4: el RMS de una voz normal es bajo; así el movimiento se nota.
    this.onLevel(Math.min(1, rms * 4));
    this.rafId = requestAnimationFrame(this._tick);
  }

  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
      this.analyser = null;
    }
    this.onLevel(0);
  }
}
