export interface IntegrationConfig {
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
  webhookSecret?: string;
  [key: string]: any; // Allow other config properties
}

export interface IntegrationMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
}

export interface IntegrationStatus extends IntegrationMetadata {
  connected: boolean;
  details?: Record<string, any>;
  lastSync?: Date;
  error?: string;
}

export abstract class BaseIntegration {
  protected metadata: IntegrationMetadata;
  protected config: IntegrationConfig;

  constructor(metadata: IntegrationMetadata, config: IntegrationConfig) {
    this.metadata = metadata;
    this.config = config;
  }

  abstract checkConnection(): Promise<boolean>;
  
  protected async getExtraDetails(): Promise<Record<string, any>> {
    return {};
  }

  async getStatus(): Promise<IntegrationStatus> {
    const connected = await this.checkConnection();
    const details = await this.getExtraDetails();

    return {
      ...this.metadata,
      connected,
      details,
      lastSync: new Date(),
    };
  }

  async handleWebhook(request: Request): Promise<Response> {
    return new Response('Webhook handler not implemented for this provider', { status: 501 });
  }
}

