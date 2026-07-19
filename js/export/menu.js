// ============================================================
// export/menu.js
// Menú desplegable del botón "Exportar": arma los <li> a partir del
// registro de formatos (formats.js). La apertura/cierre accesible
// (clic afuera, Escape, foco) la maneja dropdown.js, compartida con
// los menús de Idioma/Región/Tema.
// ============================================================

import { createDropdown } from "../dropdown.js";

export function createExportMenu({ formats, getText, els }) {
  const dropdown = createDropdown({ toggle: els.toggle, menu: els.menu });

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
        dropdown.close();
        fmt.run(getText());
      });
      li.appendChild(btn);
      els.list.appendChild(li);
    }
  }

  return { build, close: dropdown.close, isOpen: dropdown.isOpen };
}
