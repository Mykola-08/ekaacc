import { describe, it, expect } from 'vitest';
import { mockBookingAPI } from '../mock-bookings';
import { mockBillingAPI, mockTransactions } from '../mock-billing';
import { mockAssessmentsAPI, mockAssessments } from '../mock-assessments';

describe('mock APIs', () => {
  it('creates and retrieves a booking', async () => {
    const before = mockBookingAPI.getBookingsForUser('test-user');
    const newBooking = await mockBookingAPI.createBooking('test-user', 'therapist-x', new Date().toISOString(), 'note');
    expect(newBooking).toHaveProperty('id');
    const list = await mockBookingAPI.getBookingsForUser('test-user');
    expect(list.some(b => b.id === newBooking.id)).toBeTruthy();
  });

  it('applies billing adjustment and computes balance', async () => {
    const tx = await mockBillingAPI.applyAdjustment('client-1', 50, 'test credit');
    expect(tx).toHaveProperty('id');
    const res = await mockBillingAPI.getBalanceForClient('client-1');
    expect(res.transactions.some(t => t.id === tx.id)).toBeTruthy();
    expect(res.balance).toBeGreaterThanOrEqual(50);
  });

  it('saves and retrieves an assessment', async () => {
    const a = await mockAssessmentsAPI.saveAssessment('sess-1', { sessionType: 'pre', answers: {} });
    expect(a).toHaveProperty('id');
    const list = await mockAssessmentsAPI.getAssessmentsForSession('sess-1');
    expect(list.some(x => x.id === a.id)).toBeTruthy();
  });
});
