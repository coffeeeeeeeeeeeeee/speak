// ============================================================
// docs.js
// Múltiples documentos en localStorage: un índice liviano
// (id/título/fecha) más el contenido de cada uno bajo su propia
// clave, para no tener que cargar todos los documentos en memoria a
// la vez. El título se deriva automáticamente de la primera línea no
// vacía del texto (no hay rename manual, para mantener esto simple).
//
// Migra en el primer uso el autoguardado de la versión de un solo
// documento (bajo "bossa:document") a un documento real de esta
// lista, así nadie pierde lo que ya tenía escrito.
// ============================================================

const INDEX_KEY = "bossa:docs";
const CURRENT_KEY = "bossa:currentDoc";
const LEGACY_KEY = "bossa:document";

function docKey(id) {
  return `bossa:doc:${id}`;
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function titleFrom(text) {
  const firstLine = (text || "").split("\n").find((l) => l.trim());
  return firstLine ? firstLine.trim().slice(0, 60) : "";
}

function storageAvailable() {
  try {
    const probe = "__bossa_probe__";
    localStorage.setItem(probe, "1");
    localStorage.removeItem(probe);
    return true;
  } catch (_) {
    return false;
  }
}

export class DocStore {
  constructor() {
    this.ok = storageAvailable();
    this._saveTimer = null;
    if (this.ok) this._migrateLegacy();
  }

  get available() {
    return this.ok;
  }

  _migrateLegacy() {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (!legacy || this._loadIndex().length > 0) return;
    const id = this.create(legacy);
    this.setCurrentId(id);
    localStorage.removeItem(LEGACY_KEY);
  }

  _loadIndex() {
    try {
      return JSON.parse(localStorage.getItem(INDEX_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  _saveIndex(index) {
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  }

  /** Más reciente primero. */
  list() {
    return this._loadIndex().sort((a, b) => b.updatedAt - a.updatedAt);
  }

  currentId() {
    if (!this.ok) return null;
    const id = localStorage.getItem(CURRENT_KEY);
    if (id && this._loadIndex().some((d) => d.id === id)) return id;
    const list = this.list();
    return list.length ? list[0].id : null;
  }

  setCurrentId(id) {
    if (this.ok) localStorage.setItem(CURRENT_KEY, id);
  }

  load(id) {
    if (!this.ok || !id) return "";
    return localStorage.getItem(docKey(id)) || "";
  }

  create(text = "") {
    if (!this.ok) return null;
    const id = newId();
    const index = this._loadIndex();
    index.push({ id, title: titleFrom(text), updatedAt: Date.now() });
    this._saveIndex(index);
    localStorage.setItem(docKey(id), text);
    return id;
  }

  save(id, text) {
    if (!this.ok || !id) return;
    localStorage.setItem(docKey(id), text);
    const index = this._loadIndex();
    const entry = index.find((d) => d.id === id);
    if (entry) {
      entry.title = titleFrom(text);
      entry.updatedAt = Date.now();
      this._saveIndex(index);
    }
  }

  /** Igual que save(), pero con debounce — para el autoguardado en vivo. */
  saveDebounced(id, text, onSaved, delay = 600) {
    if (!this.ok || !id) return;
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => {
      this.save(id, text);
      onSaved?.();
    }, delay);
  }

  remove(id) {
    if (!this.ok || !id) return;
    localStorage.removeItem(docKey(id));
    this._saveIndex(this._loadIndex().filter((d) => d.id !== id));
    if (localStorage.getItem(CURRENT_KEY) === id) {
      localStorage.removeItem(CURRENT_KEY);
    }
  }
}
