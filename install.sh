#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

plugin_dir=$(pwd)
plugin_name=$(basename "$plugin_dir")

ln -s "$plugin_dir" "$VAULT_PATH"/.obsidian/plugins/"$plugin_name"
