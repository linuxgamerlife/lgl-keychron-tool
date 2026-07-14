# Changelog

All notable changes to LGL Keychron Helper will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- React-based WebHID device chooser to replace the current auto-grant-first-match behavior.
- Physical validation of the WebHID connection flow against a Keychron M7 8K.

## [0.0.1] - 2026-07-14

Initial Phase 1 scaffold: the smallest possible Electron application capable of loading the live Keychron Launcher and proving out the WebHID connection flow.

### Added

- Secure Electron main process (`src/main/app.ts`) that opens a sandboxed `BrowserWindow` loading `https://launcher.keychron.com/` directly, with `nodeIntegration` disabled and context isolation enabled.
- Persistent `persist:launcher` session partition so Launcher's cookies, local storage, and settings survive application restarts.
- WebHID device-selection handling (`src/main/hid-permissions.ts`) that filters the device list to Keychron's USB vendor ID and denies all other prompt-style permission requests (camera, geolocation, notifications, etc.) by default.
- Navigation and popup policy (`src/main/navigation-policy.ts`) restricting the window to Launcher's origin; other URLs open in the user's default browser instead of inside the app.
- TypeScript build configuration (`tsconfig.json`, `npm run build:main`) compiling `src/main` to `dist/main`.
- Confirmed development workflow: TypeScript build runs inside the Fedora 44 Distrobox, while the built Electron binary is executed directly on the host (`node_modules/electron/dist/electron .`), requiring no npm/Node install on the host itself.
- Custom About popup (`src/main/about-window.ts`, `resources/about/about.html`, Help → About LGL Keychron Helper) as a small sandboxed local `BrowserWindow` showing the app icon, name, and version, with GitHub and "Buy me a coffee" (Ko-fi) buttons. Both links route through the same `shell.openExternal` handler for consistent open-in-browser behavior — replacing Electron's native About panel, whose built-in website button used a separate, inconsistent OS-level mechanism.
- Full application menu (File, Edit, View, Window, Help) — replacing Electron's default menu entirely means these have to be defined explicitly rather than inherited; includes a File → Quit item.
- Back/Forward navigation menu items (View menu, `Alt+Left`/`Alt+Right`) so users can return from a Launcher sub-page even without window-manager decorations providing a back control.
- Pressing `Escape` closes the About popup.
- Wayland server-side window decorations enabled (`enable-features=WaylandWindowDecorations`, `ozone-platform-hint=auto`) so the window border/titlebar follows the host compositor theme.
- Fixed initial window size (1300×946), floored as the minimum resizable size.

### Changed

- Initial validation target switched from the Keychron K4 HE (keyboard) to the Keychron M7 8K (mouse). This changes the prototype feature scope from keymap/actuation/Rapid Trigger/Snap Click to button mapping/DPI-sensitivity/polling rate/lift-off distance; see `README.md` and `lgl-keychron-helper_projectplan.md`.

### Known limitations

- No user-facing device chooser yet — the first Keychron-vendor-ID HID device found is auto-granted. A React-based chooser is planned for Phase 2.
- The Keychron USB vendor ID filter (`0x3434`) has not yet been verified against a physical device.
- WebHID device recognition has not yet been validated against a real Keychron M7 8K.
- No React/Vite renderer, Linux permission tooling, or diagnostics yet — those are later phases per `lgl-keychron-helper_projectplan.md`.
