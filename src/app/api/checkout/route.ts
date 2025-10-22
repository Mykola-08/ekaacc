import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { getSubscriptionService } from '@/services/subscription-service';
import type { SubscriptionType, SubscriptionInterval } from '@/lib/subscription-types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userEmail, tierId, subscriptionType, interval } = body;

    // Validate required fields
    if (!userId || !userEmail || !tierId || !subscriptionType || !interval) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get tier information
    const subscriptionService = await getSubscriptionService();
    const tier = await subscriptionService.getSubscriptionTier(tierId);

    if (!tier) {
      return NextResponse.json(
        { error: 'Tier not found' },
        { status: 404 }
      );
    }

    // Get the appropriate price ID from environment variables
    // In production, these would be stored in the database or env vars
    const priceId = getPriceId(subscriptionType, interval);

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      userId,
      userEmail,
      tierId,
      subscriptionType: subscriptionType as SubscriptionType,
      interval: interval as SubscriptionInterval,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/subscriptions?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/subscriptions?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

/**
 * Get Stripe price ID based on subscription type and interval
 * In production, these should be stored in environment variables or database
 */
function getPriceId(type: string, interval: string): string | null {
  const key = `STRIPE_PRICE_${type.toUpperCase()}_${interval.toUpperCase()}`;
  return process.env[key] || null;
}
