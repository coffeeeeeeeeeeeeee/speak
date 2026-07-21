#!/bin/bash
# Levanta el servidor local de Bossa Studio (si no está corriendo) y lo
# abre en Chrome forzando una recarga sin caché (Ctrl+Shift+R), para no
# ver una versión vieja de la app en pleno desarrollo.

set -u
cd "$(dirname "$0")"

PUERTO=8791
URL="http://localhost:$PUERTO/index.html"
LOG="/tmp/bossa-studio-server.log"

if curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "200"; then
    echo "El servidor ya está corriendo en $URL"
else
    echo "Levantando el servidor en $URL ..."
    nohup python3 -m http.server "$PUERTO" > "$LOG" 2>&1 &
    disown

    # espera hasta que responda (máximo ~10 segundos)
    for i in $(seq 1 20); do
        if curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "200"; then
            break
        fi
        sleep 0.5
    done
fi

# Cache-busting: cada lanzamiento navega a una URL distinta (query de
# timestamp), así el navegador no reutiliza la versión anterior del
# HTML/JS/CSS aunque los haya cacheado. El localStorage de la app (tema,
# documentos guardados) no se ve afectado: es por origen, no por URL.
google-chrome --new-window "${URL}?_=$(date +%s)" >/dev/null 2>&1 &

echo "Listo: $URL"
