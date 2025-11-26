import { IntegrationManager } from '@/lib/integrations/manager';

describe('IntegrationManager', () => {
  let manager: IntegrationManager;

  beforeEach(() => {
    // Mock environment variables if needed, but they should be loaded by next/jest
    // or we can manually set them here for the test
    process.env.AUTH0_ISSUER_BASE_URL = 'https://test.auth0.com';
    process.env.AUTH0_CLIENT_ID = 'test-client-id-longer-than-16-chars';
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    process.env.RESEND_API_KEY = 're_123';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
    
    manager = new IntegrationManager();
  });

  it('should initialize all integrations', () => {
    // We can't access private 'integrations' map directly unless we cast to any or add a getter
    // But we can check if the methods that use them work or if we can inspect the instance
    
    // Assuming the manager has a way to check status or we can inspect the private property for testing
    const integrations = (manager as any).integrations;
    
    expect(integrations.has('auth0')).toBe(true);
    expect(integrations.has('stripe')).toBe(true);
    expect(integrations.has('resend')).toBe(true);
    expect(integrations.has('supabase')).toBe(true);
  });

  it('should have enabled status for integrations', async () => {
    const statuses = await manager.getAllStatuses();
    expect(statuses).toBeDefined();
    expect(Array.isArray(statuses)).toBe(true);
    
    const auth0Status = statuses.find((s: any) => s.id === 'auth0');
    expect(auth0Status).toBeDefined();
    expect(auth0Status!.connected).toBe(true); // Since we provided keys
  });
});
