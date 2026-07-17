// The only origin this app ever intentionally loads or grants capabilities to.
// Shared by navigation-policy.ts (restricting where the window can navigate) and
// hid-permissions.ts (restricting which origin can be granted HID device access),
// so the two checks can't drift out of sync as two independent literals.
export const ALLOWED_LAUNCHER_ORIGIN = 'https://launcher.keychron.com';
