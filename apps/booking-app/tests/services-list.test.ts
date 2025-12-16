import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GET as getServices } from '@/app/api/services/route';
import * as serviceLayer from '@/server/booking/service';

// Mock the service layer
vi.mock('@/server/booking/service', () => ({
  listServices: vi.fn(),
}));

describe('services list endpoint', () => {
  beforeEach(() => {
    vi.resetAllMocks();
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

    vi.mocked(serviceLayer.listServices).mockResolvedValue({ data: mockData, error: null } as any);

    const res = await getServices();
    expect(res.status).toBe(200);
    const json = await res.json();
    
    expect(json.services).toHaveLength(2);
  });

  it('returns empty list when no active services exist', async () => {
    vi.mocked(serviceLayer.listServices).mockResolvedValue({ data: [], error: null } as any);

    const res = await getServices();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.services).toEqual([]);
  });

  it('handles database error', async () => {
    vi.mocked(serviceLayer.listServices).mockResolvedValue({ data: null, error: { message: 'DB Error' } } as any);

    const res = await getServices();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('DB Error');
  });
});
