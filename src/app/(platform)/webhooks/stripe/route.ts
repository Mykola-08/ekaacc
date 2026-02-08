import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';

// Ensure Next.js treats this route as fully dynamic and Node runtime.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// Lazy import of services inside handler to avoid build-time side effects.

/**
 * Webhook handler for Stripe subscription events
 * Endpoint: /api/webhooks/stripe
 * 
 * NOTE: This is a simplified implementation. In production, you would need
 * to implement the full subscription service methods.
 */
export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || !stripeKey.trim().startsWith('sk_')) {
    return NextResponse.json({ skipped: true, reason: 'Stripe not configured' }, { status: 200 });
  }
  // Dynamic import to avoid initializing Stripe during build-time module evaluation.
  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(stripeKey.trim(), { apiVersion: '2025-02-24.acacia' as any });
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

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', checkoutSession.id);
        try {
          const { supabaseAdmin } = await import('@/lib/platform/supabase');
          const userId = checkoutSession.client_reference_id || checkoutSession.metadata?.userId;
          if (userId && checkoutSession.subscription) {
            // We can optionally store this mapping or update user status
            console.log(`Linked user ${userId} to subscription ${checkoutSession.subscription}`);
          }
        } catch (e) {
          console.warn('Supabase admin unavailable for checkout session:', e);
        }
        break;

      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscriptionUpdated.id);
        try {
          const { supabaseAdmin } = await import('@/lib/platform/supabase');
          const { error } = await supabaseAdmin
            .from('subscriptions')
            .update({
              status: subscriptionUpdated.status,
              current_period_end: new Date((subscriptionUpdated as any).current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscriptionUpdated.cancel_at_period_end,
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscriptionUpdated.id);
          if (error) console.error('Failed to update subscription:', error);
        } catch (e) {
          console.warn('Supabase admin unavailable for subscription update:', e);
        }
        break;

      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        console.log('Subscription deleted:', subscriptionDeleted.id);
        try {
          const { supabaseAdmin } = await import('@/lib/platform/supabase');
          const { error } = await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'cancelled',
              cancelled_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscriptionDeleted.id);
          if (error) console.error('Failed to cancel subscription:', error);
        } catch (e) {
          console.warn('Supabase admin unavailable for subscription deletion:', e);
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment succeeded for invoice:', invoice.id);
        // Keep as log for now unless we have an invoices table
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('Payment failed for invoice:', failedInvoice.id);
        // Keep as log for now
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntent.id);
        
        const { metadata, amount } = paymentIntent;
        const type = metadata.type;
        const userId = metadata.userId;

        if (type === 'wallet_topup' && userId) {
          const amountCredits = parseFloat(metadata.amountCredits || '0');
          const amountPaid = amount / 100; // Convert cents to EUR
          if (amountCredits > 0) {
            try {
              const { walletService } = await import('@/lib/platform/services/wallet-service');
              await walletService.processStripeTopUp(userId, amountCredits, paymentIntent.id, amountPaid);
              console.log(`Processed wallet top-up for user ${userId}: ${amountCredits} credits`);
            } catch (e) {
              console.warn('Wallet service unavailable during top-up processing:', e);
            }
          }
        } else if (type === 'session_prepayment' && metadata.bookingId) {
          try {
            const { supabaseAdmin } = await import('@/lib/platform/supabase');
            const bookingId = metadata.bookingId;
            const { error } = await supabaseAdmin
              .from('bookings')
              .update({
                payment_status: 'paid',
                stripe_payment_intent_id: paymentIntent.id,
                amount_paid: amount / 100,
                updated_at: new Date().toISOString()
              })
              .eq('id', bookingId);
            if (error) {
              console.error('Failed to update booking status:', error);
            } else {
              console.log(`Processed session prepayment for booking ${bookingId}`);
            }
          } catch (e) {
            console.warn('Supabase admin client unavailable for booking update:', e);
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
