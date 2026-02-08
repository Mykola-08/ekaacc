import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-02-24.acacia' as any,
  typescript: true,
});

export async function createCheckoutSession(params: any) {
  // TODO: Implement actual checkout session creation
  console.warn('createCheckoutSession called (stub)');
  return { url: 'https://checkout.stripe.com/mock-session' } as Stripe.Checkout.Session;
}

export async function createCustomerPortalSession(customerId: string, returnUrl?: string) {
  // TODO: Implement actual portal session creation
  console.warn('createCustomerPortalSession called (stub)');
  return { url: 'https://billing.stripe.com/mock-portal' } as Stripe.BillingPortal.Session;
}
