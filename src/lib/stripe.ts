import Stripe from 'stripe';
import type { SubscriptionType, SubscriptionInterval } from '@/lib/subscription-types';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
});

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

/**
 * Create a Stripe Checkout session for subscription purchase
 */
export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      customer_email: params.userEmail,
      client_reference_id: params.userId,
      metadata: {
        userId: params.userId,
        tierId: params.tierId,
        subscriptionType: params.subscriptionType,
        interval: params.interval,
      },
      subscription_data: {
        metadata: {
          userId: params.userId,
          tierId: params.tierId,
          subscriptionType: params.subscriptionType,
        },
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return session;
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Create or retrieve a Stripe customer portal session
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Failed to create portal session:', error);
    throw new Error('Failed to create portal session');
  }
}

/**
 * Cancel a Stripe subscription
 */
export async function cancelStripeSubscription(subscriptionId: string, immediate: boolean = false): Promise<Stripe.Subscription> {
  try {
    if (immediate) {
      return await stripe.subscriptions.cancel(subscriptionId);
    } else {
      return await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

/**
 * Resume a canceled subscription
 */
export async function resumeStripeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  } catch (error) {
    console.error('Failed to resume subscription:', error);
    throw new Error('Failed to resume subscription');
  }
}

/**
 * Update subscription to a different price
 */
export async function updateSubscriptionPrice(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    return await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });
  } catch (error) {
    console.error('Failed to update subscription:', error);
    throw new Error('Failed to update subscription');
  }
}

/**
 * Retrieve subscription details from Stripe
 */
export async function getStripeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Failed to retrieve subscription:', error);
    throw new Error('Failed to retrieve subscription');
  }
}

/**
 * List all subscriptions for a customer
 */
export async function getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
    });
    return subscriptions.data;
  } catch (error) {
    console.error('Failed to list subscriptions:', error);
    throw new Error('Failed to list subscriptions');
  }
}

/**
 * Create a Stripe customer
 */
export async function createStripeCustomer(
  email: string,
  name: string,
  userId: string
): Promise<Stripe.Customer> {
  try {
    return await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });
  } catch (error) {
    console.error('Failed to create customer:', error);
    throw new Error('Failed to create customer');
  }
}

export { stripe };
