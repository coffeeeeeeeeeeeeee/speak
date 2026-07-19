// ============================================================
// help.js
// Panel de comandos. Construye la lista a partir del léxico y los
// textos de interfaz activos (así nunca se desincroniza), y gestiona
// apertura/cierre accesibles. setLexicon() lo reconstruye si el
// usuario cambia de idioma sin recrear el panel.
// ============================================================

// Agrupa un mapa frase→valor en valor→[frases].
function groupByValue(map) {
  const out = new Map();
  for (const [phrase, value] of Object.entries(map)) {
    if (!out.has(value)) out.set(value, []);
    out.get(value).push(phrase);
  }
  return out;
}

export function createHelp({ lexicon, t, els }) {
  let lastFocus = null;
  build();
  wire();

  function symbolLabel(value) {
    if (value === "\n\n") return t.newParagraphLabel;
    if (value === "\n") return t.newLineLabel;
    return value;
  }

  function build() {
    els.title.textContent = t.helpTitle;
    els.intro.innerHTML = t.helpIntroHtml;
    els.closeBtn.textContent = t.helpClose;
    els.closeBtn.setAttribute("aria-label", t.helpCloseAria);

    const sections = [
      { title: t.helpSections.punctuation, map: lexicon.punctuation, desc: symbolLabel },
      { title: t.helpSections.editing, map: lexicon.editing, desc: (v) => t.actionLabels[v] },
      { title: t.helpSections.casing, map: lexicon.casing, desc: (v) => t.actionLabels[v] },
      { title: t.helpSections.history, map: lexicon.history, desc: (v) => t.actionLabels[v] },
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

  function setLexicon(newLexicon, newT) {
    lexicon = newLexicon;
    t = newT;
    build();
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

  return { open, close, isOpen, setLexicon };
}
