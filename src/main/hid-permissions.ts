import type { Session } from 'electron';

// Keychron's USB vendor ID as used across its QMK/Launcher device definitions.
// TODO(Phase 1 host testing): confirm against `lsusb` output for the physical K4 HE
// before relying on this filter for anything beyond the proof of concept.
const KEYCHRON_VENDOR_ID = 0x3434;

export function registerHidPermissions(launcherSession: Session): void {
  launcherSession.on('select-hid-device', (event, details, callback) => {
    event.preventDefault();

    const keychronDevices = details.deviceList.filter(
      (device) => device.vendorId === KEYCHRON_VENDOR_ID,
    );

    // Phase 1 proof of concept: auto-grant the first matching Keychron device so the
    // Launcher connection flow can be validated end-to-end. Phase 2 replaces this with
    // a React-based chooser that lets the user confirm the specific device.
    callback(keychronDevices[0]?.deviceId);
  });

  launcherSession.setDevicePermissionHandler((details) => {
    return details.deviceType === 'hid' && details.device.vendorId === KEYCHRON_VENDOR_ID;
  });

  launcherSession.setPermissionCheckHandler((_webContents, permission) => {
    return permission === 'hid';
  });

  // HID access is granted separately through select-hid-device / setDevicePermissionHandler
  // above; this handler covers prompt-style permissions (camera, geolocation, notifications,
  // etc.), none of which Launcher needs, so deny everything requested through it.
  launcherSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });
}
