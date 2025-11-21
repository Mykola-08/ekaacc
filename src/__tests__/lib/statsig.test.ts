import { initStatsig, checkFeature, shutdownStatsig } from '../../../src/lib/statsig';

jest.mock('statsig-node', () => ({
  initialize: jest.fn(() => Promise.resolve()),
  checkGate: jest.fn((user, key) => key !== 'wallet_enabled'),
  getConfig: jest.fn(() => ({ value: { sample: true } })),
  shutdown: jest.fn(() => Promise.resolve()),
}));

describe('statsig integration', () => {
  beforeAll(async () => {
    process.env.STATSIG_SERVER_SECRET = 'secret-test';
    await initStatsig();
  });

  afterAll(async () => {
    await shutdownStatsig();
  });

  it('evaluates a feature gate', async () => {
    const enabled = await checkFeature('ai_insights_enabled', { userID: 'user123' });
    expect(enabled).toBe(true);
  });

  it('returns false for wallet gate per mock', async () => {
    const enabled = await checkFeature('wallet_enabled', { userID: 'user123' });
    expect(enabled).toBe(false);
  });
});