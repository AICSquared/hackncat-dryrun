#!/usr/bin/env bash
# Runs when Paradev creates a workspace (a new git worktree).
# Copies your personal board settings from the main clone so tools/board and the
# Claude hooks know your channels in every workspace.
set -euo pipefail
root="${SUPERSET_ROOT_PATH:-}"
if [ -n "$root" ] && [ -f "$root/.board.env" ]; then
  cp "$root/.board.env" .board.env
  echo "Copied .board.env from the main clone."
else
  echo "No .board.env in the main clone yet. Copy .board.env.example there and fill it in."
fi
chmod +x tools/board .claude/hooks/*.sh 2>/dev/null || true
tools/board whoami >/dev/null 2>&1 && echo "GitHub OK: $(tools/board whoami)" || echo "Run: gh auth login"
