// Mock implementation replacing Stripe
import type { SubscriptionType, SubscriptionInterval } from '@/lib/subscription-types';

export const stripe: any = {
  webhooks: {
    constructEvent: () => { throw new Error('Stripe is disabled'); }
  }
};

export interface CreateCheckoutSessionParams {
  userId: string;
  userEmail: string;
  tierId: string;
  subscriptionType: SubscriptionType;
  interval: SubscriptionInterval;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<any> {
  console.log('Mocking Stripe checkout session creation for', params.userEmail);
  return {
    id: 'mock_session_' + Date.now(),
    url: params.successUrl + '?session_id=mock_session_' + Date.now()
  };
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<any> {
  return {
    url: returnUrl
  };
}

export async function cancelStripeSubscription(subscriptionId: string, immediate: boolean = false): Promise<any> {
  return { status: 'canceled' };
}

export async function resumeStripeSubscription(subscriptionId: string): Promise<any> {
  return { status: 'active' };
}

export async function updateSubscriptionPrice(
  subscriptionId: string,
  newPriceId: string
): Promise<any> {
    return { id: subscriptionId, plan: { id: newPriceId } };
}

export async function getStripeSubscription(subscriptionId: string): Promise<any> {
    return { id: subscriptionId, status: 'active' };
}

export async function getStripePaymentMethod(paymentMethodId: string): Promise<any> {
    return { id: paymentMethodId, card: { last4: '4242' } };
}

export function constructStripeWebhookEvent(body: string | Buffer, signature: string, secret: string): any {
    throw new Error('Stripe webhooks are disabled');
}

export async function getCustomerSubscriptions(customerId: string): Promise<any[]> {
    return [];
}

export async function createStripeCustomer(
  email: string,
  name: string,
  userId: string
): Promise<any> {
    return { id: 'mock_cust_' + userId, email, name };
}


