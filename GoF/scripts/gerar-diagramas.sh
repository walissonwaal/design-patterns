#!/usr/bin/env bash
# Converte todos os arquivos diagramas/*.mmd (Mermaid) em PNG ao lado do original.
#
# Uso:    bash scripts/gerar-diagramas.sh
# Opções (variáveis de ambiente):
#   CHROME_PATH  caminho de um Chrome/Chromium já instalado (evita baixar um)
#   MMDC         comando do mermaid-cli (padrão: npx -y @mermaid-js/mermaid-cli)
set -euo pipefail
cd "$(dirname "$0")/.."

MMDC="${MMDC:-npx -y @mermaid-js/mermaid-cli}"
PUPPETEER_CFG="$(mktemp)"
trap 'rm -f "$PUPPETEER_CFG"' EXIT

if [[ -n "${CHROME_PATH:-}" ]]; then
  printf '{"executablePath":"%s","args":["--no-sandbox"]}' "$CHROME_PATH" > "$PUPPETEER_CFG"
else
  printf '{"args":["--no-sandbox"]}' > "$PUPPETEER_CFG"
fi

export MMDC PUPPETEER_CFG
find . -name '*.mmd' -not -path './node_modules/*' -print0 \
  | xargs -0 -P 4 -I{} bash -c '
      f="{}"
      $MMDC -q -i "$f" -o "${f%.mmd}.png" -c scripts/mermaid-config.json \
            -p "$PUPPETEER_CFG" -s 2 -b white && echo "ok  $f"
    '
