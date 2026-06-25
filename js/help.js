// ============================================================
// help.js
// Panel de comandos. Construye la lista a partir del léxico activo
// (así nunca se desincroniza) y gestiona apertura/cierre accesibles.
// ============================================================

// Descripciones legibles de cada acción (texto de interfaz).
const ACTION_LABELS = {
  deleteWord: "borra la última palabra",
  deleteSentence: "borra la última oración",
  deleteAll: "borra toda la hoja",
  selectAll: "selecciona todo el texto",
  capitalizeNext: "mayúscula en la siguiente palabra",
  lowercaseNext: "minúscula en la siguiente palabra",
  upperOn: "empieza a escribir TODO EN MAYÚSCULAS",
  upperOff: "termina el modo mayúsculas",
  undo: "deshace lo último",
  redo: "rehace lo deshecho",
};

function symbolLabel(value) {
  if (value === "\n\n") return "salto de párrafo";
  if (value === "\n") return "salto de línea";
  return value;
}

// Agrupa un mapa frase→valor en valor→[frases].
function groupByValue(map) {
  const out = new Map();
  for (const [phrase, value] of Object.entries(map)) {
    if (!out.has(value)) out.set(value, []);
    out.get(value).push(phrase);
  }
  return out;
}

export function createHelp({ lexicon, els }) {
  let lastFocus = null;
  build();
  wire();

  function build() {
    const sections = [
      { title: "Puntuación", map: lexicon.punctuation, desc: symbolLabel },
      { title: "Edición", map: lexicon.editing, desc: (v) => ACTION_LABELS[v] },
      { title: "Mayúsculas", map: lexicon.casing, desc: (v) => ACTION_LABELS[v] },
      { title: "Historial", map: lexicon.history, desc: (v) => ACTION_LABELS[v] },
    ];

    els.body.textContent = "";
    for (const sec of sections) {
      const section = document.createElement("section");
      section.className = "help-section";

      const h = document.createElement("h3");
      h.className = "help-cat";
      h.textContent = sec.title;
      section.appendChild(h);

      for (const [value, phrases] of groupByValue(sec.map)) {
        const row = document.createElement("div");
        row.className = "cmd";

        const trigger = document.createElement("span");
        trigger.className = "cmd-trigger";
        trigger.textContent = phrases.map((p) => `«${p}»`).join(" · ");

        const desc = document.createElement("span");
        desc.className = "cmd-desc";
        desc.textContent = sec.desc(value);

        row.append(trigger, desc);
        section.appendChild(row);
      }
      els.body.appendChild(section);
    }
  }

  function open() {
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
    els.openBtn.addEventListener("click", open);
    els.closeBtn.addEventListener("click", close);
    // Cerrar al tocar el fondo (cualquier elemento con data-close).
    els.overlay.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-close")) close();
    });
  }

  return { open, close, isOpen };
}
