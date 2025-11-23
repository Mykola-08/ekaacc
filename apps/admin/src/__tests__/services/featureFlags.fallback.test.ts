import { isFlagEnabled, getAllFlags } from '@/services/featureFlags';

jest.mock('statsig-node', () => ({
  initialize: jest.fn(() => Promise.resolve()),
  checkGate: jest.fn(() => false),
  getConfig: jest.fn(() => ({ value: { sample: true } })),
  shutdown: jest.fn(() => Promise.resolve()),
}));

describe('feature flag fallbacks when secret missing', () => {
  beforeAll(() => {
    delete process.env.STATSIG_SERVER_SECRET; // ensure not initialized
  });

  it('returns fallback for wallet_enabled (false)', async () => {
    const r = await isFlagEnabled('wallet_enabled');
    expect(r.value).toBe(false);
  });

  it('returns fallback defaults for all expanded flags', async () => {
    const flags = await getAllFlags();
    const expectedKeys = [
      'ai_insights_enabled',
      'ai_chat_enabled',
      'journal_enabled',
      'goals_enabled',
      'messaging_enabled',
      'community_enabled',
      'therapist_portal_enabled',
      'therapist_booking_enabled',
      'admin_dashboard_enabled',
      'analytics_enabled',
      'subscription_tiers_enabled',
      'wallet_enabled',
      'loyalty_program_enabled',
      'referrals_enabled',
      'square_integration_enabled',
      'stripe_billing_enabled',
      'onboarding_flow_v2_enabled',
      'impersonation_enabled',
      'feature_flags_ui_enabled'
    ];
    expectedKeys.forEach(k => expect(flags).toHaveProperty(k));
  });
});