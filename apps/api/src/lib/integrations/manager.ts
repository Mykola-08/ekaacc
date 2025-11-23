import { Auth0Integration } from './auth0';
import { StripeIntegration } from './stripe';
import { ResendIntegration } from './resend';
import { SupabaseIntegration } from './supabase';
import { ZoomIntegration } from './zoom';
import { GoogleCalendarIntegration } from './google-calendar';
import { BaseIntegration } from './base';

export class IntegrationManager {
  private integrations: Map<string, BaseIntegration> = new Map();

  constructor() {
    this.initializeIntegrations();
  }

  private initializeIntegrations() {
    // Auth0
    this.integrations.set('auth0', new Auth0Integration({
      enabled: true,
      baseUrl: process.env.AUTH0_ISSUER_BASE_URL,
      apiKey: process.env.AUTH0_CLIENT_ID
    }));

    // Stripe
    this.integrations.set('stripe', new StripeIntegration({
      enabled: true,
      apiKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    }));

    // Resend
    this.integrations.set('resend', new ResendIntegration({
      enabled: true,
      apiKey: process.env.RESEND_API_KEY
    }));

    // Supabase
    this.integrations.set('supabase', new SupabaseIntegration({
      enabled: true,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
    }));

    // Zoom
    this.integrations.set('zoom', new ZoomIntegration({
      enabled: true,
      apiKey: process.env.ZOOM_CLIENT_ID,
      apiSecret: process.env.ZOOM_CLIENT_SECRET,
      accountId: process.env.ZOOM_ACCOUNT_ID
    }));

    // Google Calendar
    this.integrations.set('google-calendar', new GoogleCalendarIntegration({
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      serviceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    }));
  }

  async getAllStatuses() {
    const statuses = await Promise.all(
      Array.from(this.integrations.values()).map(i => i.getStatus())
    );
    return statuses;
  }

  getIntegration(id: string): BaseIntegration | undefined {
    return this.integrations.get(id);
  }
}

export const integrationManager = new IntegrationManager();
