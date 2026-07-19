// ============================================================
// export/txt.js
// El formato más simple: el texto tal cual, sin transformar.
// ============================================================

import { downloadBlob, defaultName } from "./download.js";

export function toTxt(text) {
  return text ?? "";
}

export function exportTxt(text, filename) {
  downloadBlob(toTxt(text), "text/plain;charset=utf-8", filename || defaultName("txt"));
}
