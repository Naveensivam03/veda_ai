#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"
ENV_EXAMPLE_FILE="${ROOT_DIR}/.env.example"

log() {
  printf '[setup] %s\n' "$1"
}

fail() {
  printf '[setup] Error: %s\n' "$1" >&2
  exit 1
}

require_command() {
  local command_name="$1"

  if ! command -v "${command_name}" >/dev/null 2>&1; then
    fail "Required command not found: ${command_name}"
  fi
}

main() {
  log "Verifying Docker installation"
  require_command docker

  if docker compose version >/dev/null 2>&1; then
    :
  else
    fail "Docker Compose is required"
  fi

  log "Verifying Bun installation"
  require_command bun

  cd "${ROOT_DIR}"

  log "Installing Bun dependencies"
  bun install

  if [[ ! -f "${ENV_FILE}" ]]; then
    log "Creating .env from .env.example"
    cp "${ENV_EXAMPLE_FILE}" "${ENV_FILE}"
  else
    log ".env already present"
  fi

  log "Starting Docker services"
  docker compose up -d --build --remove-orphans

  log "Setup complete"
  printf '\n'
  printf 'Backend API: http://localhost:5000\n'
  printf 'MongoDB data volume: mongodb_data\n'
  printf 'Worker: running via bun run worker inside Docker\n'
  
  if command -v tmux >/dev/null 2>&1; then
    log "Configuring tmux session 'vedaai'"
    
    # Kill any existing session to ensure a clean start
    tmux kill-session -t vedaai >/dev/null 2>&1 || true

    # Window 0: Logs pane (split side-by-side)
    tmux new-session -d -s vedaai -n "Logs" "docker compose logs -f backend"
    tmux split-window -h -t vedaai:0 "docker compose logs -f worker"
    tmux select-layout -t vedaai:0 even-horizontal

    # Window 1: Database Shell
    tmux new-window -t vedaai -n "Database" "docker exec -it vedaai-mongodb mongosh vedaai"

    # Select Logs window by default
    tmux select-window -t vedaai:0

    log "Tmux session 'vedaai' initialized."
    printf 'To view logs and run DB queries, attach using: tmux attach-session -t vedaai\n\n'
    
    if [[ -z "${TMUX:-}" ]]; then
      log "Attaching to tmux session now..."
      exec tmux attach-session -t vedaai
    fi
  else
    log "tmux is not installed. To monitor logs, run: docker compose logs -f backend worker"
  fi
}

main "$@"
