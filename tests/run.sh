#!/usr/bin/env bash
# Corre la suite de tests en Chrome headless: sin Node ni dependencias,
# consistente con que el proyecto es una página estática sin build step.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)"
if [ -z "$CHROME" ]; then
  echo "No se encontró Chrome/Chromium en el PATH. Instalá uno de los dos para correr los tests." >&2
  exit 1
fi

PORT=8199
python3 -m http.server "$PORT" >/tmp/speakly_test_server.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT
sleep 0.4

DOM_FILE="$(mktemp)"
trap 'kill "$SERVER_PID" 2>/dev/null || true; rm -f "$DOM_FILE"' EXIT
"$CHROME" --headless=new --disable-gpu --no-sandbox \
  --dump-dom "http://localhost:$PORT/tests/index.html" >"$DOM_FILE" 2>/dev/null

python3 - "$DOM_FILE" <<'PY'
import sys, re, html

with open(sys.argv[1], encoding="utf-8") as f:
    dom = f.read()

m = re.search(r'<pre id="output">(.*?)</pre>', dom, re.S)
if not m:
    print("No se pudo leer el resultado de los tests (¿tests/index.html no cargó bien?).")
    sys.exit(1)

text = html.unescape(m.group(1))
print(text)
sys.exit(1 if "fallaron" in text else 0)
PY
