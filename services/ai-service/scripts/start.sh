#!/usr/bin/env sh
set -eu

export OLLAMA_HOST="${OLLAMA_HOST:-0.0.0.0:11434}"
export OLLAMA_MODELS="${OLLAMA_MODELS:-/data/ollama/models}"
export OLLAMA_BASE_URL="${OLLAMA_BASE_URL:-http://127.0.0.1:11434}"

mkdir -p "$OLLAMA_MODELS"

ollama serve &
OLLAMA_PID=$!

echo "Waiting for Ollama on ${OLLAMA_BASE_URL}..."
for attempt in $(seq 1 60); do
  if curl -sf "${OLLAMA_BASE_URL}/api/tags" >/dev/null; then
    echo "Ollama is reachable."
    break
  fi

  if [ "$attempt" -eq 60 ]; then
    echo "Ollama did not become reachable before startup timeout."
  fi

  sleep 1
done

node src/server.js &
NODE_PID=$!

trap 'kill "$NODE_PID" "$OLLAMA_PID" 2>/dev/null || true' INT TERM
wait "$NODE_PID"
