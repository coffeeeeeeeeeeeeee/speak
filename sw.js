// ============================================================
// sw.js
// Service worker mínimo para instalar Bossa Studio como app y poder
// abrirla sin conexión (el dictado en sí siempre necesita internet:
// SpeechRecognition manda el audio a un servicio en la nube).
//
// Estrategia: red primero, caché como respaldo. Se prioriza la
// versión más nueva cuando hay conexión (este es un proyecto que
// cambia seguido) y se cae al caché solo si falla la red. Subir
// CACHE_VERSION invalida toda la caché vieja en el próximo `activate`.
// ============================================================

const CACHE_VERSION = "v1";
const CACHE_NAME = `bossa-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./styles/main.css",
  "./manifest.webmanifest",
  "./js/app.js",
  "./js/audioMeter.js",
  "./js/config.js",
  "./js/docs.js",
  "./js/docsPanel.js",
  "./js/editor.js",
  "./js/exporter.js",
  "./js/help.js",
  "./js/history.js",
  "./js/i18n.js",
  "./js/recognition.js",
  "./js/storage.js",
  "./js/text-ops.js",
  "./js/tts.js",
  "./js/commands/engine.js",
  "./js/commands/parser.js",
  "./js/commands/lang/de.js",
  "./js/commands/lang/en.js",
  "./js/commands/lang/es.js",
  "./js/commands/lang/fr.js",
  "./js/commands/lang/it.js",
  "./js/commands/lang/ja.js",
  "./js/commands/lang/pt.js",
  "./js/commands/lang/zh.js",
  "./js/export/download.js",
  "./js/export/formats.js",
  "./js/export/html.js",
  "./js/export/markdown.js",
  "./js/export/menu.js",
  "./js/export/print.js",
  "./js/export/rtf.js",
  "./js/export/txt.js",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Solo GET del mismo origen: dejamos pasar todo lo demás tal cual
  // (ej. las fuentes de Google Fonts, que ya tienen su propio caché
  // de navegador vía sus headers).
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
