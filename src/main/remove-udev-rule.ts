import { BrowserWindow, dialog, type MessageBoxOptions, type MessageBoxReturnValue } from 'electron';
import { execFile } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { showScriptViewWindow } from './script-view-window.js';
import { resolveUdevDir } from './udev-paths.js';

const RULE_PATH = '/etc/udev/rules.d/71-keychron-hid.rules';
const REMOVE_SCRIPT_NAME = 'remove-keychron-udev-rule.sh';

// Reachable from File > View Removal Script. Lets users inspect the exact script
// pkexec will run before they trigger Remove Device Permissions, same as the
// install popup's "View Install Script" button.
export function showRemoveUdevRuleScript(parent: BrowserWindow | null): void {
  const helperPath = path.join(resolveUdevDir(), REMOVE_SCRIPT_NAME);
  let scriptContents: string;
  try {
    scriptContents = readFileSync(helperPath, 'utf-8');
  } catch (err) {
    scriptContents = `Could not read script: ${(err as Error).message}`;
  }
  showScriptViewWindow(parent, 'Remove Device Permissions Script', REMOVE_SCRIPT_NAME, scriptContents);
}

// dialog.showMessageBox's two overloads don't accept `undefined` for the window
// argument — one takes a real BrowserWindow, the other takes no window argument at
// all. This picks the right overload based on whether a parent actually exists.
function showMessageBox(
  parent: BrowserWindow | null,
  options: MessageBoxOptions,
): Promise<MessageBoxReturnValue> {
  return parent ? dialog.showMessageBox(parent, options) : dialog.showMessageBox(options);
}

// Reachable from File > Remove Device Permissions. Uses native dialogs rather than a
// custom window, since this is a single confirm-then-run menu action, not a guided
// multi-step flow like the install popup. Runs the same narrow, fixed-operation
// privileged helper pattern via pkexec — see resources/udev/remove-keychron-udev-rule.sh.
export async function removeKeychronUdevRule(parent: BrowserWindow | null): Promise<void> {
  const confirmation = await showMessageBox(parent, {
    type: 'warning',
    buttons: ['Remove Rule', 'Cancel'],
    defaultId: 1,
    cancelId: 1,
    title: 'Remove Device Permissions',
    message: 'Remove the Keychron device permission rule?',
    detail:
      'This removes the udev rule that lets LGL Keychron Helper access Keychron devices. ' +
      "You'll need to reinstall it (the app will offer to, automatically) before it can access " +
      'a Keychron device again. You will be asked to authenticate.',
  });

  if (confirmation.response !== 0) {
    return;
  }

  const helperPath = path.join(resolveUdevDir(), REMOVE_SCRIPT_NAME);

  console.log('[remove-udev-rule] requesting udev rule removal via pkexec:', helperPath);

  execFile('pkexec', [helperPath], (error, stdout, stderr) => {
    if (error) {
      console.error('[remove-udev-rule] removal failed:', error.message, stderr?.trim());
      void showMessageBox(parent, {
        type: 'error',
        title: 'Could Not Remove Rule',
        message: 'Could not remove the device permission rule automatically.',
        detail:
          `${stderr?.toString().trim() || error.message || 'Unknown error'}\n\n` +
          'You can remove it manually instead:\n\n' +
          `sudo rm -f ${RULE_PATH}\n` +
          'sudo udevadm control --reload\n' +
          'sudo udevadm trigger',
      });
      return;
    }

    console.log('[remove-udev-rule] removal succeeded:', stdout?.trim());
    void showMessageBox(parent, {
      type: 'info',
      title: 'Rule Removed',
      message: 'The device permission rule has been removed.',
      detail: 'Keychron devices will lose HID access the next time they are unplugged and reconnected.',
    });
  });
}
