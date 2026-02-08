import { BaseIntegration, IntegrationStatus } from '@/lib/platform/integrations/base';

export class SupabaseIntegration extends BaseIntegration {
  constructor(config: { enabled: boolean; url?: string; serviceKey?: string }) {
    super(
      {
        id: 'supabase',
        name: 'Supabase',
        description: 'Open source Firebase alternative (Database, Auth, Realtime)',
        category: 'database',
        provider: 'supabase',
      },
      config
    );
  }

  async checkConnection(): Promise<boolean> {
    if (!this.config.url || !this.config.serviceKey) return false;

    try {
      // Validate URL
      const url = new URL(this.config.url);
      const validUrl = url.protocol === 'https:';

      // Validate Service Key (JWT format: header.payload.signature)
      const parts = this.config.serviceKey.split('.');
      const validKey = parts.length === 3;

      return validUrl && validKey;
    } catch (error) {
      return false;
    }
  }

  protected async getExtraDetails(): Promise<Record<string, any>> {
    return {
      url: this.config.url,
      hasServiceKey: !!this.config.serviceKey,
    };
  }
}
