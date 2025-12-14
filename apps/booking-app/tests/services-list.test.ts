import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GET as getServices } from '@/app/api/services/route';

const mockFrom = vi.fn();
const mockSupabase = {
  from: mockFrom,
};

vi.mock('@/lib/supabaseClient', () => ({
  createClient: async () => mockSupabase,
}));

describe('services list endpoint', () => {
  beforeEach(() => {
    mockFrom.mockReset();
  });

  it('returns list of active services with variants', async () => {
    const mockData = [
      { 
        id: 's1', 
        name: 'Service 1', 
        price: 100, 
        duration: 60, 
        description: 'Desc 1', 
        image_url: null,
      },
      { 
        id: 's2', 
        name: 'Service 2', 
        price: 200, 
        duration: 90, 
        description: 'Desc 2', 
        image_url: null,
      }
    ];

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const res = await getServices();
    expect(res.status).toBe(200);
    const json = await res.json();
    
    expect(json.services).toHaveLength(2);
  });

  it('falls back to services table if anon_services missing', async () => {
    mockFrom.mockImplementation((table) => {
      if (table === 'anon_services') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: null, error: { code: '42P01', message: 'undefined_table' } }),
        };
      }
      if (table === 'services') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: [{ id: 's1', name: 'Fallback' }], error: null }),
        };
      }
      return { select: vi.fn().mockReturnThis() };
    });

    const res = await getServices();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.services).toHaveLength(1);
    expect(json.services[0].name).toBe('Fallback');
  });

  it('returns empty list when no active services exist', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const res = await getServices();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.services).toEqual([]);
  });

  it('handles database error', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } }),
    });

    const res = await getServices();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('DB Error');
  });
});
