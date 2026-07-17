import { app, BrowserWindow } from 'electron';
import path from 'node:path';

// Small read-only window for displaying a script's contents, in the same
// monospace/scrollable/selectable format used by the permission-setup popup's
// "View Install Script" button, so users can review a privileged script before
// it runs.
export function showScriptViewWindow(
  parent: BrowserWindow | null,
  title: string,
  heading: string,
  scriptContents: string,
): void {
  const viewWindow = new BrowserWindow({
    width: 480,
    height: 420,
    minWidth: 320,
    minHeight: 240,
    resizable: true,
    minimizable: false,
    maximizable: true,
    fullscreenable: false,
    autoHideMenuBar: true,
    title,
    parent: parent ?? undefined,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  const htmlPath = path.join(app.getAppPath(), 'resources', 'script-view', 'script-view.html');
  void viewWindow.loadFile(htmlPath, { query: { heading, script: scriptContents } });
}
