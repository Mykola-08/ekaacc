import { BaseIntegration, IntegrationConfig } from '@/lib/platform/integrations/base';

export class GoogleCalendarIntegration extends BaseIntegration {
  constructor(config: IntegrationConfig) {
    super(
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        description: 'Schedule management and synchronization',
        category: 'calendar',
        provider: 'google',
      },
      config
    );
  }

  async checkConnection(): Promise<boolean> {
    // Check for Service Account JSON or OAuth credentials
    if (this.config.serviceAccountJson) {
      try {
        const json = JSON.parse(this.config.serviceAccountJson);
        return !!json.project_id && !!json.private_key;
      } catch {
        return false;
      }
    }
    return !!(this.config.clientId && this.config.clientSecret);
  }

  protected async getExtraDetails(): Promise<Record<string, any>> {
    return {
      mode: this.config.serviceAccountJson ? 'service-account' : 'oauth',
      hasCredentials: true,
    };
  }
}
