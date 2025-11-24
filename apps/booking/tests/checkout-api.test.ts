import { vi, describe, it, expect, beforeEach } from 'vitest';

const { mockSessionsCreate } = vi.hoisted(() => {
  return { mockSessionsCreate: vi.fn() };
});

vi.mock('stripe', () => {
  return {
    default: class Stripe {
      checkout = {
        sessions: {
          create: mockSessionsCreate,
        },
      };
    },
  };
});

import { POST as createCheckoutSession } from '@/app/api/checkout/route';

describe('checkout api', () => {
  beforeEach(() => {
    mockSessionsCreate.mockReset();
  });

  it('creates a checkout session', async () => {
    mockSessionsCreate.mockResolvedValue({
      id: 'sess_123',
      url: 'http://checkout.url',
    });

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        serviceId: 'svc1',
        serviceName: 'Test Service',
        price: 20,
        customerName: 'John',
        customerEmail: 'john@example.com',
        date: '2023-01-01',
        bookingId: 'bk1',
      }),
      headers: {
        origin: 'http://localhost',
      },
    });

    const res = await createCheckoutSession(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.sessionId).toBe('sess_123');
    expect(json.url).toBe('http://checkout.url');
    expect(mockSessionsCreate).toHaveBeenCalledWith(expect.objectContaining({
      payment_method_types: ['card'],
      line_items: expect.arrayContaining([
        expect.objectContaining({
          price_data: expect.objectContaining({
            unit_amount: 2000,
          }),
        }),
      ]),
      metadata: expect.objectContaining({
        bookingId: 'bk1',
      }),
    }));
  });

  it('handles errors', async () => {
    mockSessionsCreate.mockRejectedValue(new Error('Stripe error'));

    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await createCheckoutSession(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Stripe error');
  });
});
