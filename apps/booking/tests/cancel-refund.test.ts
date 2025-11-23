import { vi, describe, it, expect, beforeEach } from 'vitest';
import { POST as cancelBooking } from '@/app/api/booking/[id]/cancel/route';
import Stripe from 'stripe';

const mockFrom = vi.fn();
const mockSupabase = {
  from: mockFrom,
};

vi.mock('@/lib/supabaseClient', () => ({
  createClient: async () => mockSupabase,
}));

// Mock Stripe refund
vi.mock('stripe', () => {
  return {
    default: class MockStripe {
      refunds = {
        create: vi.fn().mockResolvedValue({ id: 're_123' })
      }
    }
  };
});

// Mock verifyManageToken
vi.mock('@/lib/bookingToken', () => ({
  verifyManageToken: vi.fn().mockResolvedValue({ bookingId: 'b1' }),
  signManageToken: vi.fn(),
  hashToken: vi.fn(),
}));

describe('cancel booking endpoint', () => {
  beforeEach(() => {
    mockFrom.mockReset();
  });

  it('refunds when policy allows', async () => {
    mockFrom.mockImplementation((table: string) => {
      const chain: any = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
        update: vi.fn().mockReturnThis(),
        then: (resolve: any) => resolve({ error: null }),
      };

      chain.single.mockResolvedValue({
        data: {
          id: 'b1',
          start_time: new Date(Date.now() + 48 * 3600000).toISOString(),
          cancellation_policy: { deadlineOffsetHours: 24, refundPercent: 50 },
          payment_status: 'captured',
          payment_mode: 'full',
          base_price_cents: 10000,
          addons_json: [],
          stripe_payment_intent: 'pi_123',
          status: 'scheduled',
        },
        error: null,
      });

      return chain;
    });
    
    const manageToken = 'dummy'; 
    const req = new Request('http://localhost/api/booking/b1/cancel', { method: 'POST', body: JSON.stringify({ manageToken }) });
    const res = await cancelBooking(req, { params: Promise.resolve({ id: 'b1' }) });
    const json = await res.json();
    
    expect(res.status).toBe(200);
    expect(json.refundCents).toBe(5000);
  });
});
