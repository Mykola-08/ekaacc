import Stripe from 'stripe';
import { BaseIntegration, IntegrationConfig } from '@/lib/platform/integrations/base';

export class StripeIntegration extends BaseIntegration {
  private stripeClient: Stripe | null = null;

  constructor(config: IntegrationConfig) {
    super(
      {
        id: 'stripe',
        name: 'Stripe Payments',
        description: 'Payment processing and subscription management',
        category: 'payments',
        provider: 'stripe',
      },
      config
    );

    if (config.apiKey) {
      this.stripeClient = new Stripe(config.apiKey, {
        apiVersion: '2026-02-25.clover', // Best practice to stick to latest or environment current
      });
    }
  }

  async checkConnection(): Promise<boolean> {
    if (!this.config.apiKey || !this.config.webhookSecret) return false;

    // Validate Key Formats
    const validApiKey =
      this.config.apiKey.startsWith('sk_test_') || this.config.apiKey.startsWith('sk_live_');
    const validWebhookSecret = this.config.webhookSecret.startsWith('whsec_');

    return validApiKey && validWebhookSecret;
  }

  protected async getExtraDetails(): Promise<Record<string, any>> {
    return {
      hasApiKey: !!this.config.apiKey,
      hasWebhookSecret: !!this.config.webhookSecret,
    };
  }

  async handleWebhook(request: Request): Promise<Response> {
    if (!this.config.webhookSecret) {
      return new Response('Webhook secret not configured', { status: 500 });
    }

    if (!this.stripeClient) {
      return new Response('Stripe client not initialized', { status: 500 });
    }

    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature provided', { status: 400 });
    }

    try {
      const body = await request.text();

      // Verify signature using Stripe SDK
      const event = this.stripeClient.webhooks.constructEvent(
        body,
        signature,
        this.config.webhookSecret
      );

      console.log(`[Stripe Webhook] Verified event: ${event.type} (ID: ${event.id})`);

      // TODO: Handle specific event types (e.g. customer.subscription.created)
      // Switch statement based on event.type

      return new Response(JSON.stringify({ received: true, type: event.type }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error(`[Stripe Webhook Error] Verification failed:`, err);
      return new Response(
        `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`,
        { status: 400 }
      );
    }
  }
}
