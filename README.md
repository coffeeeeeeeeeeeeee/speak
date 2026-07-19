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
- ✅ **Multi-idioma:** español, inglés, francés y portugués (léxico de comandos
  y toda la interfaz), selector en el encabezado, preferencia persistida.

## Cómo ejecutarlo

Necesita **`localhost` o HTTPS** y **Chrome o Edge** de escritorio. No funciona
con `file://`.

```bash
python3 -m http.server 8000
```

Abrí `http://localhost:8000` y permití el micrófono.

El dictado inserta **en la posición del cursor**: hacé clic donde quieras dentro de la hoja y lo que dictes (y los comandos de edición) se aplican ahí, no al final.

**Atajos:** dictar/detener `Ctrl/Cmd + J` · exportar `.txt` `Ctrl/Cmd + S` · deshacer/rehacer `Ctrl+Z` / `Ctrl+Shift+Z` · panel de comandos `Ctrl/Cmd + /`. El texto se **autoguarda** en el navegador y se recupera al recargar; *Copiar* y *Exportar* están en el encabezado.

El botón de idioma del encabezado (ES · EN · FR · PT, en ese orden) cambia el
idioma de dictado (léxico de comandos, reconocimiento de voz y toda la
interfaz). La elección queda guardada y se recupera al volver a abrir la hoja.

## Comandos de voz

Se detectan automáticamente mientras dictás. Para escribir una palabra-comando
literal, antepené **«literal»** (ej.: decir «literal punto» / «literal period»
escribe la palabra *punto* / *period*). Si un comando se dispara sin querer,
decí **«deshacer»** / **«undo»** o usá `Ctrl+Z`.

### Español

**Puntuación:** punto · punto y seguido · punto y aparte · coma · dos puntos ·
punto y coma · puntos suspensivos · abre/cierra interrogación · abre/cierra
exclamación · nueva línea · nuevo párrafo · guion · raya · comillas ·
abre/cierra paréntesis.

**Edición:** borra palabra · borra oración · borra todo · selecciona todo.

**Mayúsculas:** mayúscula (la siguiente palabra) · minúscula · todo mayúsculas ·
fin mayúsculas.

**Historial:** deshacer · rehacer (también `Ctrl+Z` / `Ctrl+Shift+Z`).

La mayúscula inicial tras punto, signo de cierre y salto de párrafo es automática.

### English

**Punctuation:** period / full stop · comma · colon · semicolon · ellipsis /
dot dot dot · question mark · exclamation mark / exclamation point · new
line / newline · new paragraph · dash / hyphen · em dash · quote / quotation
mark · open/close parenthesis.

**Editing:** delete word · delete sentence · delete all / clear all · select all.

**Casing:** capitalize / capital (next word) · lowercase · all caps / caps on ·
caps off / end caps.

**History:** undo · redo (also `Ctrl+Z` / `Ctrl+Shift+Z`).

The initial capital after a period, a closing sign, and a paragraph break is automatic.

### Français

**Ponctuation :** point · point final · virgule · deux points · point-virgule
/ point virgule · points de suspension · point d'interrogation · point
d'exclamation · nouvelle ligne / à la ligne · nouveau paragraphe · tiret ·
tiret cadratin · guillemet · ouvre/ferme parenthèse.

**Édition :** supprime/efface le mot · supprime/efface la phrase ·
supprime/efface tout · sélectionne tout.

**Majuscules :** majuscule (le mot suivant) · minuscule · tout en majuscules ·
fin des majuscules.

**Historique :** annuler · rétablir (aussi `Ctrl+Z` / `Ctrl+Shift+Z`).

La majuscule initiale après un point, un signe de fermeture et un saut de
paragraphe est automatique.

### Português

**Pontuação:** ponto / ponto final · vírgula · dois pontos · ponto e vírgula ·
reticências · ponto de interrogação · ponto de exclamação · nova linha /
quebra de linha · novo parágrafo · hífen · travessão · aspas · abre/fecha
parênteses.

**Edição:** apaga/apagar palavra · apaga/apagar frase · apaga/apagar tudo ·
selecionar tudo.

**Maiúsculas:** maiúscula (a próxima palavra) · minúscula · tudo em
maiúsculas · fim das maiúsculas.

**Histórico:** desfazer · refazer (também `Ctrl+Z` / `Ctrl+Shift+Z`).

A maiúscula inicial após ponto, sinal de fechamento e quebra de parágrafo é
automática.

## Tests

```bash
tests/run.sh
```

Corre `text-ops.js` y el parser (español, inglés, francés y portugués) en
Chrome/Chromium headless (sin Node ni dependencias, para no sumarle un build
step al proyecto). Levanta un server efímero, ejecuta `tests/index.html` y
vuelca el resultado a la terminal con código de salida 1 si algo falla.

## Estructura

```
index.html
styles/main.css
js/
  app.js            orquestación, incluye el selector de idioma
  config.js         idiomas disponibles
  i18n.js           textos de interfaz por idioma (no el léxico de comandos)
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
    lang/en.js      léxico inglés
    lang/fr.js      léxico francés
    lang/pt.js      léxico portugués (Brasil)
tests/
  tiny-test.js      test-runner casero (test/assertEqual/run)
  text-ops.test.js  suite de text-ops.js
  parser.test.js    suite del parser (léxico español)
  parser-en.test.js suite del parser (léxico inglés)
  parser-fr.test.js suite del parser (léxico francés)
  parser-pt.test.js suite del parser (léxico portugués)
  index.html        arma y corre las suites en el navegador
  run.sh            arranca un server, corre index.html en headless y reporta
```

## Notas

Solo Chrome/Edge soportan bien el reconocimiento; la precisión depende del
servicio de Google. La detección de comandos usa léxico cerrado + match
codicioso (las frases largas ganan) y conserva tildes y mayúsculas del dictado.
