import { BaseIntegration, IntegrationStatus } from '@/lib/platform/integrations/base';

export class ResendIntegration extends BaseIntegration {
  constructor(config: { enabled: boolean; apiKey?: string }) {
    super(
      {
        id: 'resend',
        name: 'Resend',
        description: 'Email delivery service for transactional emails',
        category: 'communication',
        provider: 'resend',
      },
      config
    );
  }

  async checkConnection(): Promise<boolean> {
    if (!this.config.apiKey) return false;
    
    // Resend API keys start with 're_' and are typically followed by a UUID-like string
    // Example: re_12345678_12345678
    const validPrefix = this.config.apiKey.startsWith('re_');
    const hasContent = this.config.apiKey.length > 10;

    return validPrefix && hasContent;
  }

  protected async getExtraDetails(): Promise<Record<string, any>> {
    return {
      hasApiKey: !!this.config.apiKey,
    };
  }
}
