// ============================================================
// docsPanel.js
// Panel de documentos: lista, abrir, nuevo, borrar. Mismo patrón de
// apertura/cierre accesible que help.js (backdrop, Escape, foco).
// El título de cada documento se deriva solo (docs.js), no hay
// rename manual — mantiene esto simple.
// ============================================================

import { iconMarkup } from "./icons.js";

export function createDocsPanel({ store, t, els, getCurrentId, onOpen, onCreate, onRemove }) {
  let lastFocus = null;

  function fmtDate(ts) {
    return new Date(ts).toLocaleString(undefined, {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function build(currentId) {
    els.title.textContent = t.docsTitle;
    const newLabel = els.newBtn.querySelector(".action-label");
    if (newLabel) newLabel.textContent = t.docsNew;
    els.closeBtn.setAttribute("aria-label", t.docsCloseAria);

    els.list.textContent = "";
    const docsList = store.list();
    if (!docsList.length) {
      const empty = document.createElement("p");
      empty.className = "docs-empty";
      empty.textContent = t.docsEmpty;
      els.list.appendChild(empty);
      return;
    }

    for (const doc of docsList) {
      const li = document.createElement("li");
      li.className = "docs-item";
      if (doc.id === currentId) li.classList.add("is-current");

      const openBtn = document.createElement("button");
      openBtn.type = "button";
      openBtn.className = "docs-open";
      const titleSpan = document.createElement("span");
      titleSpan.className = "docs-item-title";
      titleSpan.textContent = doc.title || t.docsUntitled;
      const dateSpan = document.createElement("span");
      dateSpan.className = "docs-item-date";
      dateSpan.textContent = fmtDate(doc.updatedAt);
      openBtn.append(titleSpan, dateSpan);
      openBtn.addEventListener("click", () => {
        close();
        onOpen(doc.id);
      });

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "docs-remove";
      removeBtn.innerHTML = iconMarkup("trash-2");
      removeBtn.setAttribute("aria-label", `${t.docsDelete}: ${doc.title || t.docsUntitled}`);
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.confirm(t.docsConfirmDelete)) {
          onRemove(doc.id);
          build(currentId === doc.id ? null : currentId);
        }
      });

      li.append(openBtn, removeBtn);
      els.list.appendChild(li);
    }
  }

  function open(currentId) {
    build(currentId);
    lastFocus = document.activeElement;
    els.overlay.hidden = false;
    els.closeBtn.focus();
    document.addEventListener("keydown", onKeydown, true);
  }

  function close() {
    els.overlay.hidden = true;
    document.removeEventListener("keydown", onKeydown, true);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function isOpen() {
    return !els.overlay.hidden;
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  function wire() {
    els.openBtn.addEventListener("click", () => open(getCurrentId()));
    els.closeBtn.addEventListener("click", close);
    els.newBtn.addEventListener("click", () => {
      onCreate();
      close();
    });
    els.overlay.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-close")) close();
    });
  }
  wire();

  return { open, close, isOpen, build };
}
