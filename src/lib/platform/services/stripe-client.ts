import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-02-24.acacia' as any,
  typescript: true,
});

export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  mode?: Stripe.Checkout.SessionCreateParams.Mode;
  metadata?: Record<string, string>;
}) {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    line_items: [{ price: params.priceId, quantity: 1 }],
    mode: params.mode || 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  });
  return session;
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl?: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || `${process.env.NEXT_PUBLIC_URL || 'http://localhost:9002'}/finances?tab=billing`,
  });
  return session;
}

export async function listCustomerInvoices(customerId: string, limit = 10) {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
    expand: ['data.charge'],
  });
  return invoices.data;
}

export async function listCustomerPaymentMethods(customerId: string) {
  const methods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });
  return methods.data;
}
