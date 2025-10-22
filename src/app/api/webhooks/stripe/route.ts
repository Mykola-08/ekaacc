import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSubscriptionService } from '@/services/subscription-service';
import type Stripe from 'stripe';

/**
 * Webhook handler for Stripe subscription events
 * Endpoint: /api/webhooks/stripe
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const subscriptionService = await getSubscriptionService();

  try {
    switch (event.type) {
      // New subscription created
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription, subscriptionService);
        break;
      }

      // Subscription updated (tier change, payment method update, etc.)
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, subscriptionService);
        break;
      }

      // Subscription deleted/canceled
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, subscriptionService);
        break;
      }

      // Payment succeeded
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice, subscriptionService);
        break;
      }

      // Payment failed
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice, subscriptionService);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  service: Awaited<ReturnType<typeof getSubscriptionService>>
) {
  const userId = subscription.metadata.userId;
  const tierId = subscription.metadata.tierId;

  if (!userId || !tierId) {
    console.error('Missing metadata in subscription:', subscription.id);
    return;
  }

  // Create subscription in our database
  await service.createSubscription(
    userId,
    tierId,
    subscription.items.data[0].price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
    subscription.id
  );

  console.log(`Subscription created: ${subscription.id} for user ${userId}`);
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  service: Awaited<ReturnType<typeof getSubscriptionService>>
) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    console.error('Missing userId in subscription:', subscription.id);
    return;
  }

  // Find our subscription by Stripe ID
  const userSubscriptions = await service.getUserSubscriptions(userId);
  const ourSubscription = userSubscriptions.find(
    s => s.stripeSubscriptionId === subscription.id
  );

  if (!ourSubscription) {
    console.error('Subscription not found in database:', subscription.id);
    return;
  }

  // Update subscription status
  if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
    await service.cancelSubscription(ourSubscription.id, true);
  }

  console.log(`Subscription updated: ${subscription.id}`);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  service: Awaited<ReturnType<typeof getSubscriptionService>>
) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    console.error('Missing userId in subscription:', subscription.id);
    return;
  }

  // Find and cancel our subscription
  const userSubscriptions = await service.getUserSubscriptions(userId);
  const ourSubscription = userSubscriptions.find(
    s => s.stripeSubscriptionId === subscription.id
  );

  if (ourSubscription) {
    await service.cancelSubscription(ourSubscription.id, true);
    console.log(`Subscription deleted: ${subscription.id}`);
  }
}

async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  service: Awaited<ReturnType<typeof getSubscriptionService>>
) {
  // Stripe Invoice may have subscription as expandable field
  const sub = (invoice as any).subscription;
  const subscriptionId = typeof sub === 'string' ? sub : sub?.id;
    
  if (!subscriptionId) return;

  console.log(`Payment succeeded for subscription: ${subscriptionId}`);
  
  // Update usage tracking or send confirmation email here
}

async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  service: Awaited<ReturnType<typeof getSubscriptionService>>
) {
  // Stripe Invoice may have subscription as expandable field
  const sub = (invoice as any).subscription;
  const subscriptionId = typeof sub === 'string' ? sub : sub?.id;
    
  if (!subscriptionId) return;

  console.log(`Payment failed for subscription: ${subscriptionId}`);
  
  // Send payment failed notification here
}
