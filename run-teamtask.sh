#!/bin/zsh

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
export PATH="$ROOT_DIR/node-v20.19.5-darwin-arm64/bin:$PATH"

npm run dev
