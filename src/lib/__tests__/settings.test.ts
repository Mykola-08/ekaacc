import { describe, it, expect, beforeEach } from 'vitest';
import fxService from '../fx-service';

describe('fxService settings persistence (mock)', () => {
  const uid = 'test-user-settings';
  beforeEach(() => {
    // clear any existing
    try { localStorage.removeItem(`eka_settings_${uid}`); } catch (e) { /* ignore */ }
  });

  it('getSettings returns defaults when none saved and updateSettings persists', async () => {
    const newSettings = { notifications: { email: false, sms: true }, patient: { reminders: false } };
    const saved = await fxService.updateSettings(uid, newSettings as any);
  expect(saved.notifications.email).toBe(false);
  expect(saved.notifications.sms).toBe(true);
  const loaded = await fxService.getSettings(uid);
  // saved should round-trip to localStorage
  expect(loaded).toEqual(saved);
  });
});
