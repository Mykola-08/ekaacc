import { stripe } from '@/lib/platform/stripe';

export const stripeService = {
  createWalletTopUpIntent: async (userId: string, amount: number) => {
    console.warn("createWalletTopUpIntent called (stub)");
    return { clientSecret: 'mock_pi_secret' };
  }
};
