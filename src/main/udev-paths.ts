import { app } from 'electron';
import path from 'node:path';

// pkexec spawns udev helper scripts as real OS processes, which can't read a path
// "inside" app.asar the way Electron's own patched fs/net APIs can — app.asar is a
// single opaque file to everything else. scripts/package.mjs unpacks resources/udev/
// to app.asar.unpacked/resources/udev/ for exactly this reason; this resolves to
// that unpacked copy when running packaged, or to the plain resources/udev/
// directory when running from source (no asar involved).
export function resolveUdevDir(): string {
  const appPath = app.getAppPath();
  const root = appPath.endsWith('.asar')
    ? path.join(path.dirname(appPath), 'app.asar.unpacked')
    : appPath;
  return path.join(root, 'resources', 'udev');
}
