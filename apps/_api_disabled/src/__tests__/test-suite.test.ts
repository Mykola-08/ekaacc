import { GET } from '../app/api/test-suite/route';
import { integrationManager } from '@/lib/integrations/manager';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

jest.mock('@/lib/integrations/manager', () => ({
  integrationManager: {
    getAllStatuses: jest.fn(),
  },
}));

describe('Test Suite API', () => {
  it('returns integration report', async () => {
    (integrationManager.getAllStatuses as jest.Mock).mockResolvedValue([
      { id: 'test', name: 'Test', connected: true, details: {}, error: null },
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.summary.total).toBe(1);
    expect(data.summary.active).toBe(1);
    expect(data.results[0].id).toBe('test');
  });
});
