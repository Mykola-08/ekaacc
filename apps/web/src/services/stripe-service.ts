import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

export class StripeService {
  private stripe: Stripe;
  private static instance: StripeService;

  private constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || !key.trim().startsWith('sk_')) {
      console.warn('StripeService: STRIPE_SECRET_KEY not configured; using noop client');
      // Provide a minimal noop implementation to avoid runtime/build errors when Stripe is unavailable.
      // Methods will throw if called, signaling misconfiguration without breaking module evaluation.
      // Only the subset of methods used by this service are stubbed.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.stripe = {
        customers: { create: async () => { throw new Error('Stripe not configured'); } },
        paymentIntents: {
          create: async () => { throw new Error('Stripe not configured'); },
          retrieve: async () => { throw new Error('Stripe not configured'); }
        },
        refunds: { create: async () => { throw new Error('Stripe not configured'); } },
        webhooks: { constructEvent: () => { throw new Error('Stripe not configured'); } }
      } as any as Stripe;
      return;
    }
    this.stripe = new Stripe(key.trim(), {
      apiVersion: '2025-02-24.acacia', // Use latest available version
    });
  }

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  /**
   * Get or create a Stripe customer for a user
   */
  async getOrCreateCustomer(userId: string, email: string, name?: string): Promise<string> {
    // Check if user already has a stripe_customer_id
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('user_id', userId) // Assuming user_id is the PK or FK in user_profiles
      .single();

    if (profile?.stripe_customer_id) {
      return profile.stripe_customer_id;
    }

    // Create new customer
    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    // Save to DB
    await supabaseAdmin
      .from('user_profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('user_id', userId); // Assuming user_id is the column name

    return customer.id;
  }

  /**
   * Calculate price for virtual euros with quantity discounts
   * 100 EUR -> 1% discount
   * 1000 EUR -> 10% discount
   * Linear interpolation in between
   */
  calculateWalletPrice(amountEUR: number): { price: number; discountPercent: number } {
    let discountPercent = 0;

    if (amountEUR < 100) {
      discountPercent = 0;
    } else if (amountEUR >= 1000) {
      discountPercent = 10;
    } else {
      // Linear interpolation: y = mx + c
      // (100, 1), (1000, 10)
      // m = (10 - 1) / (1000 - 100) = 9 / 900 = 0.01
      // y - 1 = 0.01 * (x - 100)
      // y = 0.01x - 1 + 1 = 0.01x
      // Wait, 100 * 0.01 = 1. 1000 * 0.01 = 10.
      // So discount percent is simply amount / 100?
      // Let's check: 500 -> 5%. Correct.
      discountPercent = amountEUR / 100;
    }

    const discountAmount = amountEUR * (discountPercent / 100);
    const price = amountEUR - discountAmount;

    return {
      price: Math.round(price * 100) / 100, // Round to 2 decimal places
      discountPercent,
    };
  }

  /**
   * Create a PaymentIntent for wallet top-up
   */
  async createWalletTopUpIntent(userId: string, amountEUR: number): Promise<{ clientSecret: string; paymentIntentId: string; price: number }> {
    const { data: user } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (!user || !user.user) throw new Error('User not found');

    const customerId = await this.getOrCreateCustomer(userId, user.user.email!, user.user.user_metadata?.full_name);
    const { price, discountPercent } = this.calculateWalletPrice(amountEUR);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(price * 100), // Amount in cents
      currency: 'eur',
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: 'wallet_topup',
        userId,
        creditsAmount: amountEUR,
        discountPercent,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
      price,
    };
  }

  /**
   * Create a PaymentIntent for session prepayment
   */
  async createSessionPrepaymentIntent(userId: string, sessionId: string, amount: number): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const { data: user } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (!user || !user.user) throw new Error('User not found');

    const customerId = await this.getOrCreateCustomer(userId, user.user.email!, user.user.user_metadata?.full_name);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: 'eur',
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: 'session_prepayment',
        userId,
        sessionId,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
    const params: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    };
    
    if (amount) {
      params.amount = Math.round(amount * 100);
    }

    return await this.stripe.refunds.create(params);
  }

  /**
   * Verify a payment intent status
   */
  async verifyPayment(paymentIntentId: string): Promise<boolean> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status === 'succeeded';
  }
}

// Lazy singleton accessor exported as a function to encourage guarded usage if needed elsewhere.
export const stripeService = StripeService.getInstance();
