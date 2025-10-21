import { describe, it, expect } from 'vitest';
import { mockBillingAPI } from '../mock-billing';

describe('billing charges', () => {
  it('creates a charge for session and returns a transaction', async () => {
    const tx = await mockBillingAPI.createChargeForSession('client-42', 'sess-42', 120, 'Therapy session');
    expect(tx).toHaveProperty('id');
    expect(tx).toHaveProperty('clientId', 'client-42');
    expect(tx.amountEUR).toBeLessThan(0);
  });
});
