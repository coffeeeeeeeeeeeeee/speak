# speakly

Voz a texto para escritores. Una hoja infinita a pantalla completa donde se
transcribe en vivo lo que decís por el micrófono, con comandos verbales de
edición.

## Estado

- ✅ **Fase 1 — Andamiaje:** hoja a pantalla completa, diseño, detección de soporte.
- ✅ **Fase 2 — Dictado continuo:** transcripción en vivo, auto-reinicio, conteo.
- ✅ **Fase 3 — Comandos:** puntuación, mayúscula automática, edición, mayúsculas,
  deshacer/rehacer y `literal`, con detección automática (sin palabra clave).
- ✅ **Fase 6 — Persistencia:** múltiples documentos, autoguardado local,
  exportar (`.txt`/`.html`/`.rtf`/`.md`/PDF), copiar.
- ✅ **Fase 7 — Pulido:** panel de comandos, avisos de error, limpieza de
  espaciado, accesibilidad, diseño plano (sin bordes/contornos), 6 temas
  intercambiables (ver [Temas](#temas)), acordeón de acciones en pantallas
  chicas.
- ✅ **Multi-idioma:** español, inglés, francés, portugués, alemán, italiano,
  chino y japonés (léxico de comandos y toda la interfaz), con variantes
  regionales dentro de cada uno (ver [Idiomas y variantes](#idiomas-y-variantes)),
  preferencia persistida. Chino/japonés usan tokenización por carácter (ver
  [Notas](#notas)) en vez de por palabra.
- ✅ **Instalable:** manifest + service worker — se puede instalar como app y
  abrir sin conexión (el dictado en sí siempre necesita internet).
- ✅ **Medidor de nivel de audio** y **lectura en voz alta** (SpeechSynthesis).

## Cómo ejecutarlo

Necesita **`localhost` o HTTPS** y **Chrome o Edge** de escritorio. No funciona
con `file://`.

```bash
python3 -m http.server 8000
```

Abrí `http://localhost:8000` y permití el micrófono.

El dictado inserta **en la posición del cursor**: hacé clic donde quieras dentro de la hoja y lo que dictes (y los comandos de edición) se aplican ahí, no al final.

**Atajos:** dictar/detener `Ctrl/Cmd + J` · exportar `.txt` `Ctrl/Cmd + S` · deshacer/rehacer `Ctrl+Z` / `Ctrl+Shift+Z` · panel de comandos `Ctrl/Cmd + /`. El texto se **autoguarda** en el navegador y se recupera al recargar; *Copiar* y *Exportar* están en el encabezado.

### Idiomas y variantes

El botón **IDIOMA** abre un desplegable (igual que "Exportar") con todas las
familias (Español · English · Français · Português · Deutsch · Italiano ·
中文 · 日本語): elegir una cambia léxico de comandos, reconocimiento de voz e
interfaz. El botón **REGIÓN**, al lado, abre otro desplegable con las
variantes regionales de la familia activa (afecta solo el código que recibe
SpeechRecognition, útil para mejorar la precisión según el acento —
es-ES/AR/MX/US, en-US/GB/AU/IN, fr-FR/CA, pt-BR/PT, de-DE/AT/CH, it-IT/CH; se
oculta si el idioma tiene una sola variante, como chino/japonés). Ambos
quedan guardados por separado, así cambiar de idioma no resetea la región
que ya habías elegido en cada uno.

También podés cambiar de idioma **dictando**: cada léxico tiene una frase
distintiva para eso (ver la sección "Idiomas" del panel de comandos), por
ejemplo «cambiar a inglés» en español o «switch to spanish» en inglés.

### Exportar

**Exportar** abre un menú con los formatos disponibles: **TXT**, **HTML**,
**RTF** y **MD** (se abren directo en Word/LibreOffice/Google Docs/cualquier
editor de texto) y **PDF** — este último no descarga nada: abre el diálogo
nativo de impresión del navegador para que elijas "Guardar como PDF" ahí
(funciona con cualquier idioma sin necesidad de embeber fuentes). `Ctrl/Cmd + S`
sigue exportando `.txt` directo, sin pasar por el menú.

### Documentos

El botón **Documentos** abre un panel con todos los documentos guardados
(título derivado de la primera línea, sin rename manual). Desde ahí se abre
uno existente, se crea uno nuevo o se borra uno (con confirmación). Cambiar
de documento resetea el deshacer/rehacer del anterior.

### Formato

La hoja reconoce una sintaxis liviana tipo Markdown y la pinta en vivo
mientras se escribe: `**negrita**`, `*cursiva*`, `~~tachado~~` y
`++subrayado++`. Sigue siendo texto plano por debajo (nada de
`contentEditable`): `js/markdownOverlay.js` convierte ese texto a HTML y lo
pinta en una capa (`.editor-overlay`) pegada detrás del `<textarea>` real,
que queda con el texto transparente (solo se ven ahí el cursor y la
selección nativa). Por eso los marcadores no se ocultan, solo se atenúan
(`.md-mark`): si desaparecieran, el overlay tendría menos caracteres que el
textarea y el ajuste de línea de los dos dejaría de coincidir.

El reconocimiento de esa sintaxis vive en `js/markdownInline.js`, compartido
con la exportación: **HTML** y **PDF** (que arma su hoja imprimible con las
mismas funciones que HTML) la traducen a `<strong>/<em>/<s>/<u>` reales, y
**RTF** a los control words `\b/\i/\strike/\ul`. **MD** no necesita traducir
nada — ya es la sintaxis de origen.

El **alineado** (`[center]`, `[right]`, `[left]`, `[justify]`, ver
`js/textAlign.js`) es distinto: a diferencia de negrita/cursiva/tachado/
subrayado, que envuelven un tramo cualquiera, el alineado es una propiedad
de PÁRRAFO — el marcador va al principio y afecta a todo ese párrafo. En el
overlay cada párrafo se pinta en su propio `<div>` con su `text-align`
(`.md-para`), con el separador en blanco pegado adentro para que la altura
total siga calzando con la del `<textarea>` de abajo (que es un solo bloque
de texto plano); `text-align` no mueve el punto donde se corta la línea,
solo la posición horizontal de cada renglón ya partido, así que separar en
`<div>`s no desalinea nada. Al exportar a HTML/PDF/RTF, a diferencia del
overlay, el marcador SÍ se saca del texto — ahí no hace falta mostrarlo, el
párrafo directamente sale alineado. En **MD** el marcador queda como texto
plano (`[center]`, etc.): no hay forma de representar alineado en Markdown
de origen.

El **estilo de párrafo** (`js/textStyle.js`) es un marcador más del mismo
tipo que el alineado — **Título general** (`[title]`), **Subtítulo**
(`[subtitle]`), **Título 1** a **Título 4** (`[h1]`..`[h4]`) y **Cita**
(`[quote]`) — y convive con él: si un párrafo tiene los dos, el orden
canónico es estilo primero y alineado después (`[h1][center]texto`), sin
importar en qué orden los haya aplicado el usuario — `setParagraphStyle()`/
`setParagraphAlign()` en `js/editor.js` siempre reconstruyen el párrafo en
ese orden. En el overlay en vivo el estilo SOLO cambia peso/cursiva/color,
nunca el tamaño de letra: a diferencia de `text-align`, el `font-size` sí
mueve el punto de ajuste de línea, y como el `<textarea>` real es un tamaño
único para todo el documento, un párrafo más grande en el overlay
desalinearía su ajuste (y en cascada, la posición de todo lo que sigue)
respecto del `<textarea>` de abajo. La jerarquía tipográfica real (con
tamaños distintos) vive en la exportación: **HTML**/**PDF** usan
`<h1>`-`<h5>`/`<blockquote>`/`<p class="subtitle">` (título general = h1,
título 1-4 bajan un nivel a h2-h5 para no competir con él), **RTF** usa
`\fs`/`\b`/`\i`, y **MD** usa `#`-`#####`/`>` reales (subtítulo, sin
equivalente en Markdown, queda en cursiva).

Todo lo anterior también se puede aplicar con clic desde una **barra de
formato** (`.edit-toolbar`), oculta por default: el ícono de formato del
encabezado (`editToolbarToggle`, el de la "T", en `.actions`) la despliega.
Es estática, no parte de la hoja — vive en `.app` como hermana de
`.topbar`/`.sheet`/`.hud`, así que queda fija debajo del encabezado y no se
mueve con el scroll de la página (`.sheet` es lo único que hace scroll).
Negrita/cursiva/tachado/subrayado insertan la misma marca que su comando de
voz equivalente (`editor.insertAtCaret()`); alineado y estilo reemplazan el
marcador de ESE párrafo (`setParagraphAlign()`/`setParagraphStyle()`) en vez
de solo insertar — así conviven entre sí sin apilarse ni dejar un espacio
suelto que rompa el reconocimiento del segundo marcador.

### Otras acciones

**Leer**, al lado del botón **Dictar** (mismo grupo en el pie de la hoja),
usa la síntesis de voz del navegador para releer el documento en voz alta —
se bloquea mutuamente con el dictado (no tiene sentido que el micrófono capte
la propia lectura). Su ícono alterna entre "play" y "pause" según si está
leyendo o no, igual que "Completa"/"Salir" alternan maximize/minimize en
pantalla completa. Mientras lee, va **seleccionando** (selección nativa del
`<textarea>`, no un resaltado con color aparte) la palabra que se está
diciendo en cada momento, tipo karaoke, usando el evento `boundary` de
`SpeechSynthesis`. Si la voz activa no da límites por palabra (pasa con
algunas voces, sobre todo fuera de inglés) y solo da límites por oración,
selecciona la oración completa en su lugar — degrada, no se rompe. Al lado
de "Dictar" también hay un **medidor de nivel de audio**: es aparte del
reconocimiento en sí (Web Speech no expone el stream ni parámetros de audio
como ganancia o cancelación de eco), solo confirma visualmente que el
micrófono está captando algo.

**Completa** pone la app en pantalla completa (Fullscreen API); el botón
cambia solo a "Salir" si se sale con Esc en vez de tocarlo de nuevo.

### Íconos

Los botones usan íconos de [Lucide](https://lucide.dev) — pero no cargando
su librería por CDN: `js/icons.js` tiene el SVG de cada uno inline (siempre
sacado de lucide.dev/el repo del que sale: `github.com/lucide-icons/lucide`),
sin dependencia de red en tiempo de ejecución. Cada ícono usa
`stroke="currentColor"`, así que hereda el color
de texto automáticamente en los 6 temas sin código extra por tema. Se
insertan una sola vez al arrancar (no cambian entre idiomas).

Los botones son solo-ícono, sin texto visible: lo que hace cada uno vive en
`title`/`aria-label` (aparece como tooltip nativo al pasar el mouse, y lo
leen los lectores de pantalla). El botón **Dictar** se resalta con un color
propio (`--mic`) distinto del acento general de la interfaz en los temas
Claro, Oscuro, Sepia y Naturaleza; Neón y Alto contraste no definen uno propio
y usan el acento general como color de "Dictar" (mismo mecanismo de
fallback que `--accent-2`/`--accent-3`: `var(--mic, var(--accent))`).

En pantallas angostas (menos de 720px), las acciones del encabezado se
pliegan en un acordeón: el botón **▾** las muestra apiladas.

## Temas

El botón de tema (en el encabezado) abre un desplegable (igual que
"Exportar") con los 6 temas: **Claro**,
**Oscuro**, **Neón** (magenta de acento, amarillo como color de resaltado,
hoja blanca con letra azul oscuro, mismo azul oscuro de fondo detrás de
la hoja, tipografía mono para todo), **Sepia** (lectura cálida, serif
clásica), **Alto contraste**
(blanco y negro puros, sin grises intermedios, sans del sistema) y
**Naturaleza** (verdes saturados, calma). Sin elegir ninguno, sigue la
preferencia de color del sistema (claro/oscuro). La elección queda
guardada.

Cada tema define su paleta y, opcionalmente, su propia tipografía —
`js/themes.js` es el único lugar que hay que tocar para sumar uno nuevo, sin
tocar CSS: `theme.js` aplica `colors`/`fonts` como custom properties sobre
`<html>` en tiempo de ejecución. El diseño general no usa bordes/contornos:
la separación entre zonas es contraste de color + sombra de elevación en los
paneles, y los estados de hover/foco son un relleno de color, no un trazo.

Al final del desplegable de temas hay una opción **Personalizar…** que abre
un panel con seis selectores de color (hoja/fondo/texto/acento/dictar/alerta)
precargados con los del tema activo. Al guardar, esos seis colores se aplican
de una y quedan guardados como un séptimo tema, **Personalizado** (a partir de
ahí aparece como una opción más del desplegable, y se puede reabrir el editor
para retocarlo). El resto de las variables de la paleta (ink-soft/ghost/
line/accent-dim) no se eligen a mano: se derivan mezclando texto/acento con
transparencia (`js/customTheme.js`), el mismo criterio que usa **Alto
contraste** a mano en `js/themes.js` — así el usuario no tiene que picker-ear
9+ colores para terminar con un tema coherente.

Cada color tiene, además del swatch nativo (`<input type="color">`), un campo
de texto hex al lado, sincronizado en los dos sentidos: el selector nativo en
Linux/GTK suele abrir en la pestaña de sliders RGB en vez de hex, así que el
campo de texto es la forma directa de escribir el valor sin depender de eso.
Un hex inválido/a medio escribir no se aplica al swatch hasta que sea válido,
y se corrige solo al salir del campo (`js/themeEditor.js`).

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

**Formato:** negrita · cursiva · tachado · subrayado (se dicen dos veces,
para abrir y cerrar — igual que «comillas»).

**Alineado:** centrar · justificar · alinear a la derecha · alinear a la
izquierda (se dice UNA vez, al empezar el párrafo — afecta solo a ese párrafo).

**Historial:** deshacer · rehacer (también `Ctrl+Z` / `Ctrl+Shift+Z`).

**Idiomas:** cambiar a inglés · cambiar a francés · cambiar a portugués ·
cambiar a alemán · cambiar a italiano · cambiar a chino · cambiar a japonés.

La mayúscula inicial tras punto, signo de cierre y salto de párrafo es automática.

### English

**Punctuation:** period / full stop · comma · colon · semicolon · ellipsis /
dot dot dot · question mark · exclamation mark / exclamation point · new
line / newline · new paragraph · dash / hyphen · em dash · quote / quotation
mark · open/close parenthesis.

**Editing:** delete word · delete sentence · delete all / clear all · select all.

**Casing:** capitalize / capital (next word) · lowercase · all caps / caps on ·
caps off / end caps.

**Formatting:** bold · italic · strikethrough / strike through · underline
(said twice, to open and close — same as «quote»).

**Alignment:** center · justify · align right · align left (said ONCE, at
the start of the paragraph — affects only that paragraph).

**History:** undo · redo (also `Ctrl+Z` / `Ctrl+Shift+Z`).

**Languages:** switch to spanish · switch to french · switch to portuguese ·
switch to german · switch to italian · switch to chinese · switch to japanese.

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

**Mise en forme :** gras · italique · barré · souligné (se disent deux fois,
pour ouvrir et fermer — comme « guillemet »).

**Alignement :** centrer · justifier · aligner à droite · aligner à gauche
(se dit UNE fois, au début du paragraphe — n'affecte que ce paragraphe).

**Historique :** annuler · rétablir (aussi `Ctrl+Z` / `Ctrl+Shift+Z`).

**Langues :** passer en espagnol · passer en anglais · passer en portugais ·
passer en allemand · passer en italien · passer en chinois · passer en japonais.

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

**Formatação:** negrito · itálico · tachado · sublinhado (ditos duas vezes,
para abrir e fechar — igual "aspas").

**Alinhamento:** centralizar · justificar · alinhar à direita · alinhar à
esquerda (dito UMA vez, no início do parágrafo — afeta só esse parágrafo).

**Histórico:** desfazer · refazer (também `Ctrl+Z` / `Ctrl+Shift+Z`).

**Idiomas:** mudar para espanhol · mudar para inglês · mudar para francês ·
mudar para alemão · mudar para italiano · mudar para chinês · mudar para japonês.

A maiúscula inicial após ponto, sinal de fechamento e quebra de parágrafo é
automática.

### Deutsch

**Zeichensetzung:** punkt · komma · doppelpunkt · semikolon ·
auslassungspunkte · fragezeichen · ausrufezeichen · neue zeile /
zeilenumbruch · neuer absatz · bindestrich · gedankenstrich ·
anführungszeichen · klammer auf/zu.

**Bearbeiten:** wort löschen · satz löschen · alles löschen · alles auswählen.

**Groß-/Kleinschreibung:** großschreiben (nächstes Wort) · kleinschreiben ·
alles großschreiben · großschreibung beenden.

**Formatierung:** fett · kursiv · durchgestrichen · unterstrichen (zweimal
gesagt, zum Öffnen und Schließen — wie „anführungszeichen").

**Ausrichtung:** zentrieren · blocksatz · rechtsbündig · linksbündig (EINMAL
gesagt, am Anfang des Absatzes — betrifft nur diesen Absatz).

**Verlauf:** rückgängig · wiederholen (auch `Strg+Z` / `Strg+Umschalt+Z`).

**Sprachen:** wechseln zu spanisch · wechseln zu englisch · wechseln zu
französisch · wechseln zu portugiesisch · wechseln zu italienisch · wechseln
zu chinesisch · wechseln zu japanisch.

Der Großbuchstabe nach einem Punkt und am Absatzanfang ist automatisch.

### Italiano

**Punteggiatura:** punto · virgola · due punti · punto e virgola · puntini
di sospensione · punto interrogativo · punto esclamativo · nuova riga / a
capo · nuovo paragrafo · trattino · lineetta · virgolette · apri/chiudi
parentesi.

**Modifica:** cancella parola · cancella frase · cancella tutto · seleziona
tutto.

**Maiuscole:** maiuscola (la parola successiva) · minuscola · tutto
maiuscolo · fine maiuscolo.

**Formattazione:** grassetto · corsivo · barrato · sottolineato (dette due
volte, per aprire e chiudere — come «virgolette»).

**Allineamento:** centra · giustifica · allinea a destra · allinea a
sinistra (detto UNA volta, all'inizio del paragrafo — vale solo per quello).

**Cronologia:** annulla · ripristina (anche `Ctrl+Z` / `Ctrl+Maiusc+Z`).

**Lingue:** passa a spagnolo · passa a inglese · passa a francese · passa a
portoghese · passa a tedesco · passa a cinese · passa a giapponese.

La maiuscola iniziale dopo un punto, un segno di chiusura e un'interruzione
di paragrafo è automatica.

### 中文

**标点符号：** 句号 · 逗号 · 顿号 · 冒号 · 分号 · 省略号 · 问号 · 感叹号 ·
换行 · 换段 · 破折号 · 左/右括号 · 左/右引号。

**编辑：** 删除词/删除单词 · 删除句子 · 全部删除/删除全部 · 全选。

**大小写**（主要用于混入的拉丁字母/英文词）**：** 首字母大写 · 首字母小写 ·
全部大写 · 取消大写。

**格式：** 粗体 · 斜体 · 删除线 · 下划线（说两次，一次开始一次结束——跟
"左引号/右引号"不同，这几个用同一个词）。

**对齐：** 居中 · 两端对齐 · 右对齐 · 左对齐（只说一次，在段落开头——
只影响那一段）。

**历史记录：** 撤销 · 重做（也可用 `Ctrl+Z` / `Ctrl+Shift+Z`）。

**语言：** 切换到西班牙语 · 切换到英语 · 切换到法语 · 切换到葡萄牙语 ·
切换到德语 · 切换到意大利语 · 切换到日语。

句号后及段落开头的自动大写，只对混入的拉丁字母生效。

### 日本語

**句読点：** 句点 · 読点 · コロン · セミコロン · 三点リーダー · 疑問符 ·
感嘆符 · 改行 · 改段落 · ダッシュ · 括弧開く/閉じる · かぎ括弧開く/閉じる。

**編集：** 単語を削除 · 文を削除 · 全部削除 · すべて選択。

**大文字/小文字**（主に混在するラテン文字・英単語向け）**：** 大文字にする ·
小文字にする · すべて大文字 · 大文字終わり。

**書式：** 太字 · 斜体 · 取り消し線 · 下線（開始と終了で2回言います。
「かぎ括弧開く/閉じる」とは違い、同じ語を2回使います）。

**配置：** 中央揃え · 両端揃え · 右揃え · 左揃え（段落の先頭で1回だけ
言います。その段落だけに効きます）。

**履歴：** 元に戻す · やり直す（`Ctrl+Z` / `Ctrl+Shift+Z` も使えます）。

**言語：** スペイン語に切り替え · 英語に切り替え · フランス語に切り替え ·
ポルトガル語に切り替え · ドイツ語に切り替え · イタリア語に切り替え ·
中国語に切り替え。

句点の後や段落の先頭での自動大文字化は、混在するラテン文字に対してのみ
働きます。

## Tests

```bash
tests/run.sh
```

Corre `text-ops.js`, `export/` y el parser (los 8 idiomas) en Chrome/Chromium
headless (sin Node ni dependencias, para no sumarle un build step al
proyecto). Levanta un server efímero, ejecuta `tests/index.html` y vuelca el
resultado a la terminal con código de salida 1 si algo falla.

Las features que son sobre todo integración de UI (variantes regionales,
cambio de idioma por voz de punta a punta, documentos múltiples, medidor de
audio, lectura en voz alta, PWA, tema) no tienen suite propia — se
verificaron a mano en un navegador real (Chrome headless con dispositivo de
audio *fake*, más una pasada en Chrome de escritorio con LibreOffice para el
RTF) en vez de con tests automatizados, porque dependen de APIs del
navegador (getUserMedia, SpeechSynthesis, Service Worker) difíciles de
simular fielmente en este runner casero.

## Estructura

```
index.html
manifest.webmanifest
sw.js               service worker (red primero, caché de respaldo)
icons/              icon.svg + icon-192.png/icon-512.png rasterizados del mismo SVG
styles/main.css     incluye la paleta oscura (prefers-color-scheme + [data-theme])
js/
  app.js            orquestación: idioma/variante, documentos, tema, todo lo demás
  config.js         familias de idioma + sus variantes regionales
  i18n.js           textos de interfaz por idioma (no el léxico de comandos)
  themes.js         registro de temas — sumar uno nuevo es solo agregarlo acá
  theme.js          aplica un tema (custom properties en runtime, persistido)
  customTheme.js    persistencia + derivación de colores del tema "Personalizado"
  themeEditor.js    panel de selectores de color para armar el tema "Personalizado"
  icons.js          íconos de Lucide inline (SVG a mano, sin cargar su librería)
  dropdown.js       abrir/cerrar accesible + armado de opciones, compartido por
                     los desplegables de Exportar/Idioma/Región/Tema
  recognition.js    Web Speech API + auto-reinicio
  editor.js         hoja (textarea) + render
  markdownInline.js  reconoce **/*/~~/++ — lo comparten el overlay y export/
  textAlign.js       reconoce [center]/[right]/[left]/[justify] por párrafo
  textStyle.js       reconoce [title]/[subtitle]/[h1..h4]/[quote] por párrafo
  markdownOverlay.js negrita/cursiva/tachado/subrayado/alineado/estilo en vivo
  text-ops.js       operaciones puras de texto (testeable)
  history.js        deshacer / rehacer
  storage.js        autoguardado genérico (localStorage) — clave/valor simple
  docs.js           múltiples documentos (índice + contenido en localStorage)
  docsPanel.js       panel de documentos (crear/abrir/borrar)
  exporter.js       copiar al portapapeles (no es un formato de archivo)
  audioMeter.js     medidor de nivel de audio (getUserMedia + AnalyserNode aparte)
  tts.js            leer el documento en voz alta (SpeechSynthesis)
  help.js           panel de comandos
  commands/
    engine.js       aplica los comandos al editor, incluye el cambio de idioma
    parser.js       segmenta dictado vs comandos (soporta tokenize: "char")
    lang/es.js      léxico español
    lang/en.js      léxico inglés
    lang/fr.js      léxico francés
    lang/pt.js      léxico portugués (Brasil)
    lang/de.js      léxico alemán
    lang/it.js      léxico italiano
    lang/zh.js      léxico chino (tokenize: "char")
    lang/ja.js      léxico japonés (tokenize: "char")
  export/           módulos de guardado — un formato por archivo
    download.js     Blob + <a download> compartido, nombre de archivo por defecto
    txt.js          .txt (texto tal cual)
    html.js         .html (documento autocontenido, un <p> por párrafo)
    rtf.js          .rtf (control words a mano, sin librerías)
    markdown.js     .md (escapa sintaxis accidental, no es Markdown de origen)
    print.js        "PDF" vía diálogo de impresión del navegador (#printSheet)
    formats.js       registro de formatos que arma el menú
    menu.js          arma los <li> del menú de Exportar sobre dropdown.js
tests/
  tiny-test.js      test-runner casero (test/assertEqual/run)
  text-ops.test.js  suite de text-ops.js
  export.test.js    suite de export/ (toTxt/toHtml/toRtf)
  parser.test.js    suite del parser (léxico español)
  parser-en.test.js suite del parser (léxico inglés)
  parser-fr.test.js suite del parser (léxico francés)
  parser-pt.test.js suite del parser (léxico portugués)
  parser-de.test.js suite del parser (léxico alemán)
  parser-it.test.js suite del parser (léxico italiano)
  parser-zh.test.js suite del parser (léxico chino, char-tokenize)
  parser-ja.test.js suite del parser (léxico japonés, char-tokenize)
  index.html        arma y corre las suites en el navegador
  run.sh            arranca un server, corre index.html en headless y reporta
```

## Notas

Solo Chrome/Edge soportan bien el reconocimiento; la precisión depende del
servicio de Google. La detección de comandos usa léxico cerrado + match
codicioso (las frases largas ganan) y conserva tildes y mayúsculas del dictado.

**Chino y japonés no separan palabras con espacios**, así que el parser no
puede tokenizar por espacio para esos dos idiomas como hace con el resto.
Sus léxicos (`lang/zh.js`, `lang/ja.js`) declaran `tokenize: "char"`, lo que
le indica a `commands/parser.js` que trabaje por CARÁCTER en vez de por
palabra: el transcript se parte en caracteres individuales, el match
codicioso prueba de más a menos caracteres, y el buffer de texto libre se
reconstruye sin espacio entre caracteres. `text-ops.joiner()` también sabe
que el chino/japonés (y su puntuación de ancho completo) nunca lleva un
espacio occidental por default, sin importar qué idioma esté activo.

**La Web Speech API no expone el micrófono ni parámetros de audio**
(ganancia, cancelación de eco, `deviceId`, sample rate) como sí lo hace
`getUserMedia` — el navegador captura del dispositivo default del sistema y
manda el audio al servicio de reconocimiento sin darle a la página ningún
control sobre eso. Lo único accionable desde acá para mejorar la precisión es
elegir la variante regional correcta (ver arriba) y, en teoría,
`SpeechGrammarList` para sesgar el reconocimiento hacia el léxico de
comandos — pero el soporte de Chrome para eso es casi un no-op hoy, así que
no se usa. El medidor de nivel de audio (`audioMeter.js`) es una
verificación aparte con `getUserMedia` propio, no una mejora del
reconocimiento en sí.
