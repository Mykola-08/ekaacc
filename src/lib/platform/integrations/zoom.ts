import { BaseIntegration, IntegrationConfig } from '@/lib/platform/integrations/base';

export class ZoomIntegration extends BaseIntegration {
  constructor(config: IntegrationConfig) {
    super(
      {
        id: 'zoom',
        name: 'Zoom Meetings',
        description: 'Video conferencing for therapy sessions',
        category: 'communication',
        provider: 'zoom',
      },
      config
    );
  }

  async checkConnection(): Promise<boolean> {
    if (!this.config.apiKey || !this.config.apiSecret) return false;
    // Basic validation for JWT or OAuth credentials
    return this.config.apiKey.length > 10 && this.config.apiSecret.length > 10;
  }

  protected async getExtraDetails(): Promise<Record<string, any>> {
    return {
      hasClientId: !!this.config.apiKey,
      hasClientSecret: !!this.config.apiSecret,
      accountId: this.config.accountId,
    };
  }
}

