import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GET as availability } from '@/app/api/services/[id]/availability/route';

const mockFrom = vi.fn();
const mockSupabase = {
  from: mockFrom,
};

vi.mock('@/lib/supabaseClient', () => ({
  createClient: async () => mockSupabase,
}));

describe('availability endpoint', () => {
  beforeEach(() => {
    mockFrom.mockReset();
  });

  it('returns slots per staff schedule', async () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0,10);
    
    mockFrom.mockImplementation((table: string) => {
      if (table === 'service') return { select() { return this; }, eq() { return this; }, single: async () => ({ data: { id: 'svc1', duration: 60, name: 'Test' }, error: null }) };
      if (table === 'staff_schedule') return { select() { return this; }, eq() { return this; }, then: (resolve: any) => resolve({ data: [{ staff_id: 'staff1', start_hour: 9, end_hour: 12, active: true }], error: null }) } as any;
      if (table === 'booking') return { select() { return this; }, eq() { return this; }, gte() { return this; }, lt() { return this; }, then: (resolve: any) => resolve({ data: [], error: null }) } as any;
      return { select() { return this; } } as any;
    });

    const req = new Request(`http://localhost/api/services/svc1/availability?date=${dateStr}`);
    const res = await availability(req, { params: Promise.resolve({ id: 'svc1' }) });
    const json = await res.json();
    expect(json.slots.length).toBeGreaterThan(0);
    expect(json.slots[0].staffId).toBe('staff1');
  });
});
