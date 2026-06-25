# speakly

Voz a texto para escritores. Una hoja infinita a pantalla completa donde se
transcribe en vivo lo que decís por el micrófono, con comandos verbales de
edición.

## Estado

- ✅ **Fase 1 — Andamiaje:** hoja a pantalla completa, diseño, detección de soporte.
- ✅ **Fase 2 — Dictado continuo:** transcripción en vivo, auto-reinicio, conteo.
- ✅ **Fase 3 — Comandos:** puntuación, mayúscula automática, edición, mayúsculas,
  deshacer/rehacer y `literal`, con detección automática (sin palabra clave).
- ✅ **Fase 6 — Persistencia:** autoguardado local, exportar `.txt`, copiar.
- ✅ **Fase 7 — Pulido:** panel de comandos, avisos de error, limpieza de espaciado, accesibilidad.

## Cómo ejecutarlo

Necesita **`localhost` o HTTPS** y **Chrome o Edge** de escritorio. No funciona
con `file://`.

```bash
python3 -m http.server 8000
```

Abrí `http://localhost:8000` y permití el micrófono.

**Atajos:** dictar/detener `Ctrl/Cmd + J` · exportar `.txt` `Ctrl/Cmd + S` · deshacer/rehacer `Ctrl+Z` / `Ctrl+Shift+Z` · panel de comandos `Ctrl/Cmd + /`. El texto se **autoguarda** en el navegador y se recupera al recargar; *Copiar* y *Exportar* están en el encabezado.

## Comandos de voz (español)

Se detectan automáticamente mientras dictás. Para escribir una palabra-comando
literal, antepené **«literal»** (ej.: decir «literal punto» escribe la palabra
*punto*). Si un comando se dispara sin querer, decí **«deshacer»** o usá `Ctrl+Z`.

**Puntuación:** punto · punto y seguido · punto y aparte · coma · dos puntos ·
punto y coma · puntos suspensivos · abre/cierra interrogación · abre/cierra
exclamación · nueva línea · nuevo párrafo · guion · raya · comillas ·
abre/cierra paréntesis.

**Edición:** borra palabra · borra oración · borra todo · selecciona todo.

**Mayúsculas:** mayúscula (la siguiente palabra) · minúscula · todo mayúsculas ·
fin mayúsculas.

**Historial:** deshacer · rehacer (también `Ctrl+Z` / `Ctrl+Shift+Z`).

La mayúscula inicial tras punto, signo de cierre y salto de párrafo es automática.

## Estructura

```
index.html
styles/main.css
js/
  app.js            orquestación
  config.js         idioma e i18n
  recognition.js    Web Speech API + auto-reinicio
  editor.js         hoja (textarea) + render
  text-ops.js       operaciones puras de texto (testeable)
  history.js        deshacer / rehacer
  storage.js        autoguardado (localStorage)
  exporter.js       exportar .txt + copiar
  help.js           panel de comandos
  commands/
    engine.js       aplica los comandos al editor
    parser.js       segmenta dictado vs comandos
    lang/es.js      léxico español
```

## Notas

Solo Chrome/Edge soportan bien el reconocimiento; la precisión depende del
servicio de Google. La detección de comandos usa léxico cerrado + match
codicioso (las frases largas ganan) y conserva tildes y mayúsculas del dictado.
