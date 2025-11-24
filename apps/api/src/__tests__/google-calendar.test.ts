
import { GoogleCalendarIntegration } from '@/lib/integrations/google-calendar';

describe('GoogleCalendarIntegration', () => {
  it('should initialize correctly', async () => {
    const integration = new GoogleCalendarIntegration({});
    const status = await integration.getStatus();
    expect(status.id).toBe('google-calendar');
    expect(status.name).toBe('Google Calendar');
  });

  it('should return false for checkConnection if no credentials', async () => {
    const integration = new GoogleCalendarIntegration({});
    const isConnected = await integration.checkConnection();
    expect(isConnected).toBe(false);
  });

  it('should return true for checkConnection with valid service account json', async () => {
    const validJson = JSON.stringify({ project_id: 'test', private_key: 'key' });
    const integration = new GoogleCalendarIntegration({ serviceAccountJson: validJson });
    const isConnected = await integration.checkConnection();
    expect(isConnected).toBe(true);
  });

  it('should return false for checkConnection with invalid service account json', async () => {
    const invalidJson = 'invalid-json';
    const integration = new GoogleCalendarIntegration({ serviceAccountJson: invalidJson });
    const isConnected = await integration.checkConnection();
    expect(isConnected).toBe(false);
  });

  it('should return true for checkConnection with oauth credentials', async () => {
    const integration = new GoogleCalendarIntegration({ clientId: 'id', clientSecret: 'secret' });
    const isConnected = await integration.checkConnection();
    expect(isConnected).toBe(true);
  });
});
