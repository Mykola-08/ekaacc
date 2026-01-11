import { stripe } from '@/lib/platform/services/stripe-client';

export const stripeService = {
  createWalletTopUpIntent: async (userId: string, amount: number) => {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_mock') {
      // Return mock for development without Stripe
      return { clientSecret: null, error: 'Stripe not configured' };
    }
    
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'eur',
        metadata: { userId, type: 'wallet_topup' },
      });
      return { clientSecret: paymentIntent.client_secret, error: null };
    } catch (error) {
      console.error('Stripe createWalletTopUpIntent error:', error);
      return { clientSecret: null, error: 'Failed to create payment intent' };
    }
  }
};
