import { shell, type BrowserWindow } from 'electron';

const ALLOWED_ORIGIN = 'https://launcher.keychron.com';

function isAllowedOrigin(url: string): boolean {
  try {
    return new URL(url).origin === ALLOWED_ORIGIN;
  } catch {
    return false;
  }
}

export function registerNavigationPolicy(window: BrowserWindow): void {
  window.webContents.on('will-navigate', (event, url) => {
    if (!isAllowedOrigin(url)) {
      event.preventDefault();
      void shell.openExternal(url);
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (!isAllowedOrigin(url)) {
      void shell.openExternal(url);
    }
    return { action: 'deny' };
  });
}
