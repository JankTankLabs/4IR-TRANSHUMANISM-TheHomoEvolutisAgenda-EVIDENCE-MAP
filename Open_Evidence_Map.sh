#!/usr/bin/env bash
set -euo pipefail
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$APP_DIR/index.html"
elif command -v open >/dev/null 2>&1; then
  open "$APP_DIR/index.html"
else
  echo "Open this file in your browser: $APP_DIR/index.html"
fi
