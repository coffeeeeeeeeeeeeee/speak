// ============================================================
// dropdown.js
// Comportamiento accesible común a los menús desplegables del
// encabezado (Exportar, Idioma, Región, Tema): abre bajo el botón,
// cierra con click afuera o Escape. Cada menú arma su propia lista de
// opciones (ver renderMenuItems), esto solo maneja abrir/cerrar.
// ============================================================

/** `returnFocusTo`, si viene, es a quién vuelve el foco al cerrar en
 * vez del elemento enfocado antes de abrir (comportamiento estándar de
 * diálogo/menú accesible) — esta app lo usa para que el cursor
 * siempre vuelva a la hoja de escritura pase lo que pase, no al botón
 * que abrió el menú. */
export function createDropdown({ toggle, menu, returnFocusTo }) {
  let isOpen = false;
  let lastFocus = null;

  function open() {
    isOpen = true;
    lastFocus = document.activeElement;
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    menu.querySelector("button")?.focus();
    document.addEventListener("click", onOutsideClick, true);
    document.addEventListener("keydown", onKeydown, true);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", onOutsideClick, true);
    document.removeEventListener("keydown", onKeydown, true);
    const target = returnFocusTo || lastFocus;
    if (target && target.focus) target.focus();
  }

  function toggleOpen() {
    isOpen ? close() : open();
  }

  function onOutsideClick(e) {
    if (!menu.contains(e.target) && e.target !== toggle) close();
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  toggle.addEventListener("click", toggleOpen);

  return { open, close, isOpen: () => isOpen };
}

/** Arma la lista de <li><button class="export-item"> de un menú (mismo
 * look que "Exportar") a partir de `items` ({ key, label, title? }[]).
 * `title`, si viene, se pone en `data-tip` (tooltip propio, ver
 * [data-tip] en main.css) — lo usa el desplegable de idioma para
 * mostrar el nombre en inglés de idiomas/regiones en un script que el
 * usuario puede no leer. Marca la opción activa según `isCurrent(key)`
 * y corre `onSelect(key)` al elegir una — el callback es responsable
 * de cerrar el menú si corresponde (normalmente sí, salvo casos que
 * quieran mantenerlo abierto). */
export function renderMenuItems(listEl, items, { isCurrent, onSelect }) {
  listEl.textContent = "";
  for (const item of items) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "export-item";
    btn.setAttribute("role", "menuitemradio");
    const current = isCurrent(item.key);
    btn.setAttribute("aria-checked", String(current));
    if (current) btn.classList.add("is-current");
    btn.textContent = item.label;
    if (item.title) btn.dataset.tip = item.title;
    btn.addEventListener("click", () => onSelect(item.key));
    li.appendChild(btn);
    listEl.appendChild(li);
  }
}
