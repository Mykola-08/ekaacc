import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-02-25.clover' as any,
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

export async function createCustomerPortalSession(customerId: string, returnUrl?: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url:
      returnUrl || `${process.env.NEXT_PUBLIC_URL || 'http://localhost:9002'}/finances?tab=billing`,
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

// --- Admin Capabilities ---

export async function listAllCustomers(limit = 50, startingAfter?: string) {
  const params: Stripe.CustomerListParams = { limit };
  if (startingAfter) params.starting_after = startingAfter;
  const customers = await stripe.customers.list(params);
  return customers;
}

export async function listAllSubscriptions(
  limit = 50,
  status?: Stripe.SubscriptionListParams.Status
) {
  const params: Stripe.SubscriptionListParams = { limit, expand: ['data.customer'] };
  if (status) params.status = status;
  const subscriptions = await stripe.subscriptions.list(params);
  return subscriptions;
}

export async function listAllInvoices(limit = 50, status?: Stripe.InvoiceListParams.Status) {
  const params: Stripe.InvoiceListParams = { limit, expand: ['data.customer'] };
  if (status) params.status = status;
  const invoices = await stripe.invoices.list(params);
  return invoices;
}

export async function refundPayment(
  chargeId: string,
  amount?: number,
  reason?: Stripe.RefundCreateParams.Reason
) {
  const params: Stripe.RefundCreateParams = { charge: chargeId };
  if (amount) params.amount = amount;
  if (reason) params.reason = reason;
  const refund = await stripe.refunds.create(params);
  return refund;
}

export async function cancelSubscription(subscriptionId: string, prorate: boolean = true) {
  if (prorate) {
    return await stripe.subscriptions.cancel(subscriptionId, { prorate: true });
  } else {
    return await stripe.subscriptions.cancel(subscriptionId);
  }
}
