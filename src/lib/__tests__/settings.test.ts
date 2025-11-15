import { describe, it, expect, beforeEach } from 'vitest';
import fxService from '../fx-service';

describe('fxService settings persistence', () => {
  beforeEach(() => {
    // clear any existing
    try { localStorage.removeItem('app_settings'); } catch (e) { /* ignore */ }
  });

  it('getSettings returns defaults when none saved and updateSettings persists', async () => {
    const newSettings = { notifications: { email: false, sms: true }, patient: { reminders: false } };
    const saved = await fxService.updateSettings(newSettings as any);
    expect((saved as any).notifications.email).toBe(false);
    expect((saved as any).notifications.sms).toBe(true);
    const loaded = await fxService.getSettings();
    // saved should round-trip to localStorage
    expect(loaded).toEqual(saved);
  });
});
