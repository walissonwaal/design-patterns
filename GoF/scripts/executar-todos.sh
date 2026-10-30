#!/usr/bin/env bash
# Executa todos os exemplos .ts e informa quais falharam.
set -uo pipefail
cd "$(dirname "$0")/.."

falhas=0
for arquivo in 0*/*/exemplo.ts; do
  if npx tsx "$arquivo" > /dev/null 2>&1; then
    echo "ok     $arquivo"
  else
    echo "FALHOU $arquivo"
    falhas=$((falhas + 1))
  fi
done
echo "---"
echo "$falhas exemplo(s) com falha"
exit "$falhas"
