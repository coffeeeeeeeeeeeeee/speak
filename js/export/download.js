// ============================================================
// export/download.js
// Plumbing compartida por los módulos de este directorio: arma un
// Blob y dispara la descarga vía un <a download> temporal, y genera
// el nombre de archivo por defecto (mismo prefijo, distinta extensión).
// ============================================================

export function downloadBlob(content, mime, filename) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function defaultName(ext) {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `bossa-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(
    d.getHours()
  )}${p(d.getMinutes())}.${ext}`;
}
