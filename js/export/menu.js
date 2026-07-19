// ============================================================
// export/menu.js
// Menú desplegable del botón "Exportar": arma los <li> a partir del
// registro de formatos (formats.js) y gestiona apertura/cierre
// accesibles (clic afuera, Escape), en el mismo espíritu que help.js.
// ============================================================

export function createExportMenu({ formats, getText, els }) {
  let isOpen = false;
  let lastFocus = null;

  function build(t) {
    els.list.textContent = "";
    for (const fmt of formats) {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "export-item";
      btn.setAttribute("role", "menuitem");
      btn.textContent = fmt.label;
      if (fmt.print) {
        btn.setAttribute("aria-label", `${fmt.label} — ${t.pdfMenuAria}`);
      }
      btn.addEventListener("click", () => {
        close();
        fmt.run(getText());
      });
      li.appendChild(btn);
      els.list.appendChild(li);
    }
  }

  function open() {
    isOpen = true;
    lastFocus = document.activeElement;
    els.menu.hidden = false;
    els.toggle.setAttribute("aria-expanded", "true");
    els.list.querySelector("button")?.focus();
    document.addEventListener("click", onOutsideClick, true);
    document.addEventListener("keydown", onKeydown, true);
  }

  function close() {
    isOpen = false;
    els.menu.hidden = true;
    els.toggle.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", onOutsideClick, true);
    document.removeEventListener("keydown", onKeydown, true);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function toggle() {
    isOpen ? close() : open();
  }

  function onOutsideClick(e) {
    if (!els.menu.contains(e.target) && e.target !== els.toggle) close();
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  els.toggle.addEventListener("click", toggle);

  return { build, close, isOpen: () => isOpen };
}
