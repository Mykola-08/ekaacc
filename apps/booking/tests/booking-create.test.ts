import { vi, describe, it, expect, beforeEach } from 'vitest';
import { POST as createBooking } from '@/app/api/booking/route';

const mockFrom = vi.fn();
const mockSupabase = {
  from: mockFrom,
};

vi.mock('@/lib/supabaseClient', () => ({
  createClient: async () => mockSupabase,
}));

vi.mock('@/lib/bookingToken', () => ({
  signManageToken: vi.fn().mockResolvedValue('mock_token'),
  hashToken: vi.fn().mockReturnValue('mock_hash'),
}));

vi.mock('@/lib/events', () => ({
  emitEvent: vi.fn(),
}));

describe('booking create endpoint', () => {
  beforeEach(() => {
    mockFrom.mockReset();
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
      or: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ error: null }),
    });
  });

  it('rejects missing fields', async () => {
    const req = new Request('http://localhost/api/booking', { method: 'POST', body: JSON.stringify({}) });
    const res = await createBooking(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toMatch(/Missing/);
  });

  it('creates booking', async () => {
    // 1. Service fetch
    mockFrom.mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: { id: 'svc1', name: 'Test', price: 10, duration: 60 }, error: null })
        })
      })
    }));

    // 2. Overlap check (booking select)
    mockFrom.mockImplementationOnce(() => {
      const chain: any = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        filter: vi.fn().mockReturnThis(),
        then: (resolve: any) => resolve({ data: [], error: null })
      };
      return chain;
    });

    // 3. Staff schedule fetch
    mockFrom.mockImplementationOnce(() => {
      const chain: any = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        then: (resolve: any) => resolve({ data: [], error: null })
      };
      return chain;
    });

    // 4. Booking insert
    mockFrom.mockImplementationOnce(() => ({
      insert: async () => ({ error: null })
    }));

    const body = {
      serviceId: 'svc1',
      startTime: new Date().toISOString(),
      email: 'user@example.com',
      paymentMode: 'full',
      addons: [],
    };
    const req = new Request('http://localhost/api/booking', { method: 'POST', body: JSON.stringify(body) });
    const res = await createBooking(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.bookingId).toBeTruthy();
    expect(json.manageToken).toBeTruthy();
  });
});
