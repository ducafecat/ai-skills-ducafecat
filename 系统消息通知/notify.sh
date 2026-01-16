#!/usr/bin/env bash
set -euo pipefail

TITLE="${1:-AI Skills}"
BODY="${2:-任务完成}"

terminal-notifier -title "${TITLE}" -message "${BODY}" -open "https://ducafecat.com"
