#!/usr/bin/env bash
set -euo pipefail

# Removes the LGL Keychron Helper udev rule, if present, and reloads udev.
#
# This script accepts no arguments and performs no arbitrary operations: the
# target path is fixed. It is invoked via `pkexec` from LGL Keychron Helper's
# main process only, when the user asks to remove the previously installed
# device-permission rule.

DEST_RULE="/etc/udev/rules.d/71-keychron-hid.rules"

rm -f "${DEST_RULE}"
udevadm control --reload
udevadm trigger --subsystem-match=hidraw

echo "Removed ${DEST_RULE} if present, and reloaded udev rules."
