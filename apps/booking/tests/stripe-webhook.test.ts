import { vi, describe, it, expect, beforeEach } from 'vitest';

const { mockConstructEvent } = vi.hoisted(() => {
  return { mockConstructEvent: vi.fn() };
});

vi.mock('stripe', () => {
  return {
    default: class Stripe {
      webhooks = {
        constructEvent: mockConstructEvent,
      };
    },
  };
});

const mockFrom = vi.fn();
const mockSupabase = {
  from: mockFrom,
};
vi.mock('@/lib/supabaseClient', () => ({
  createClient: async () => mockSupabase,
}));

vi.mock('@/lib/events', () => ({
  emitEvent: vi.fn(),
}));

import { POST as webhookHandler } from '@/app/api/stripe/webhook/route';
import { emitEvent } from '@/lib/events';

describe('stripe webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
    mockFrom.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
  });

  it('handles checkout.session.completed', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: { bookingId: 'bk1' },
          payment_intent: 'pi_123',
        },
      },
    });

    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: 'raw_body',
      headers: {
        'stripe-signature': 'sig_123',
      },
    });

    const res = await webhookHandler(req);
    expect(res.status).toBe(200);
    expect(mockFrom).toHaveBeenCalledWith('booking');
    expect(emitEvent).toHaveBeenCalledWith('payment.captured', { bookingId: 'bk1', paymentIntent: 'pi_123' });
  });

  it('handles signature verification failure', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: 'raw_body',
      headers: {
        'stripe-signature': 'sig_invalid',
      },
    });

    const res = await webhookHandler(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/verification failed/);
  });
});
