// ============================================================
// exporter.js
// Exportar el texto a un archivo .txt y copiar al portapapeles.
// Con fallbacks para entornos sin Clipboard API.
// ============================================================

export function exportTxt(text, filename) {
  const blob = new Blob([text ?? ""], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || defaultName();
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function copyText(text) {
  const value = text ?? "";
  // Camino moderno: Clipboard API (requiere contexto seguro / localhost).
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch (_) {
    /* caemos al fallback */
  }
  // Fallback: textarea temporal + execCommand.
  try {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch (_) {
    return false;
  }
}

function defaultName() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `bossa-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(
    d.getHours()
  )}${p(d.getMinutes())}.txt`;
}
