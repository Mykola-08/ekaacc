import { BaseIntegration, IntegrationConfig } from './base';

export class Auth0Integration extends BaseIntegration {
  constructor(config: IntegrationConfig) {
    super(
      {
        id: 'auth0',
        name: 'Auth0 Identity Provider',
        description: 'Identity management and authentication service',
        category: 'auth',
        provider: 'auth0',
      },
      config
    );
  }

  async checkConnection(): Promise<boolean> {
    if (!this.config.baseUrl || !this.config.apiKey) return false;

    try {
      // Validate URL format
      const url = new URL(this.config.baseUrl);
      const isAuth0Domain = url.hostname.endsWith('.auth0.com') || url.hostname.endsWith('.eu.auth0.com');
      
      // Validate Client ID format (typically 32 chars, alphanumeric)
      // But we'll just check it's not empty and has reasonable length
      const validClientId = this.config.apiKey.length >= 16;

      return isAuth0Domain && validClientId;
    } catch {
      return false;
    }
  }

  protected async getExtraDetails(): Promise<Record<string, any>> {
    return {
      baseUrl: this.config.baseUrl,
      hasClientId: !!this.config.apiKey,
    };
  }
}
