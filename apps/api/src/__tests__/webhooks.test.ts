import { POST } from '../app/api/webhooks/[provider]/route';
import { integrationManager } from '@/lib/integrations/manager';

jest.mock('@/lib/integrations/manager', () => ({
  integrationManager: {
    getIntegration: jest.fn(),
  },
}));

describe('Webhooks API', () => {
  it('returns 404 for unknown provider', async () => {
    (integrationManager.getIntegration as jest.Mock).mockReturnValue(null);
    const req = new Request('http://localhost');
    const params = Promise.resolve({ provider: 'unknown' });
    
    const response = await POST(req, { params });
    expect(response.status).toBe(404);
  });

  it('delegates to integration handler', async () => {
    const mockHandler = jest.fn().mockResolvedValue(new Response('OK'));
    (integrationManager.getIntegration as jest.Mock).mockReturnValue({
      handleWebhook: mockHandler,
    });
    const req = new Request('http://localhost');
    const params = Promise.resolve({ provider: 'test' });

    const response = await POST(req, { params });
    expect(response.status).toBe(200);
    expect(mockHandler).toHaveBeenCalledWith(req);
  });

  it('handles errors', async () => {
    const mockHandler = jest.fn().mockRejectedValue(new Error('Fail'));
    (integrationManager.getIntegration as jest.Mock).mockReturnValue({
      handleWebhook: mockHandler,
    });
    const req = new Request('http://localhost');
    const params = Promise.resolve({ provider: 'test' });

    const response = await POST(req, { params });
    expect(response.status).toBe(500);
  });
});
