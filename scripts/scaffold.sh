#!/usr/bin/env bash

set -euo pipefail

# Ensure target directory is provided
if [ -z "${1:-}" ]; then
  echo "Error: Target directory is required." >&2
  echo "Usage: $0 <target_directory>" >&2
  exit 1
fi

TARGET_DIR="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "Scaffolding new Zola site in: ${TARGET_DIR}..."

# Create target directory if it doesn't exist
mkdir -p "${TARGET_DIR}"
TARGET_DIR_ABS="$(cd "${TARGET_DIR}" && pwd)"

# Initialize git if not already in a git repo
if [ ! -d "${TARGET_DIR_ABS}/.git" ]; then
  echo "Initializing git repository..."
  git init "${TARGET_DIR_ABS}"
fi

# Copy template files
echo "Copying configuration and content files..."
cp "${WORKSPACE_ROOT}/zola.toml" "${TARGET_DIR_ABS}/"
cp "${WORKSPACE_ROOT}/mise.toml" "${TARGET_DIR_ABS}/"
cp "${WORKSPACE_ROOT}/.gitignore" "${TARGET_DIR_ABS}/"
cp "${WORKSPACE_ROOT}/pitchfork.toml" "${TARGET_DIR_ABS}/"

# Copy directories recursively
cp -R "${WORKSPACE_ROOT}/content" "${TARGET_DIR_ABS}/"
cp -R "${WORKSPACE_ROOT}/static" "${TARGET_DIR_ABS}/"
if [ -d "${WORKSPACE_ROOT}/syntaxes" ]; then
  cp -R "${WORKSPACE_ROOT}/syntaxes" "${TARGET_DIR_ABS}/"
fi

# Set up theme submodule in the target directory
cd "${TARGET_DIR_ABS}"
echo "Adding zola-astroplate theme submodule..."
if [ ! -d "themes/zola-astroplate" ]; then
  mkdir -p themes
  git submodule add https://github.com/worrydont/zola-astroplate.git themes/zola-astroplate
fi

# Fetch and initialize submodules
git submodule update --init --recursive

echo "Scaffolding complete! You can run:"
echo "  cd ${TARGET_DIR}"
echo "  mise run setup"
echo "  mise run serve"
