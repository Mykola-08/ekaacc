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
    const priceIdKey = `STRIPE_PRICE_${tierId.toUpperCase()}_${subscriptionType.toUpperCase()}_${interval.toUpperCase()}`;
    const priceId = process.env[priceIdKey];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price not configured for this tier' },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await createCheckoutSession({
      userId,
      userEmail,
      tierId,
      subscriptionType,
      interval,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/subscriptions?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/subscriptions?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
