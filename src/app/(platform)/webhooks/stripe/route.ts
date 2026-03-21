import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';

// Lazy import of services inside handler to avoid build-time side effects.

async function getSupabaseAdmin() {
  const { supabaseAdmin } = await import('@/lib/platform/supabase');
  return supabaseAdmin;
}

async function persistInvoice(invoice: Stripe.Invoice, status: 'paid' | 'failed' | 'voided') {
  try {
    const admin = await getSupabaseAdmin();
    const customerId =
      typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;

    // Resolve user by stripe_customer_id
    const { data: profile } = await admin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    await admin.from('billing_invoices').upsert(
      {
        stripe_invoice_id: invoice.id,
        user_id: profile?.id ?? null,
        stripe_customer_id: customerId ?? null,
        amount: (invoice.amount_paid ?? invoice.amount_due ?? 0) / 100,
        currency: invoice.currency ?? 'eur',
        status,
        hosted_invoice_url: invoice.hosted_invoice_url ?? null,
        invoice_pdf: invoice.invoice_pdf ?? null,
        period_start: invoice.period_start
          ? new Date(invoice.period_start * 1000).toISOString()
          : null,
        period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'stripe_invoice_id' }
    );
  } catch (e) {
    console.error('Failed to persist invoice:', e);
  }
}

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
      // ── Checkout ────────────────────────────────────────────────
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', checkoutSession.id);
        try {
          const admin = await getSupabaseAdmin();
          const userId = checkoutSession.client_reference_id || checkoutSession.metadata?.userId;
          if (userId && checkoutSession.subscription) {
            const subscriptionId =
              typeof checkoutSession.subscription === 'string'
                ? checkoutSession.subscription
                : checkoutSession.subscription.id;
            await admin.from('subscriptions').upsert(
              {
                user_id: userId,
                stripe_subscription_id: subscriptionId,
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'stripe_subscription_id' }
            );
            console.log(`Linked user ${userId} to subscription ${subscriptionId}`);
          }
        } catch (e) {
          console.warn('Supabase admin unavailable for checkout session:', e);
        }
        break;
      }

      // ── Subscriptions ──────────────────────────────────────────
      case 'customer.subscription.updated': {
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscriptionUpdated.id);
        try {
          const admin = await getSupabaseAdmin();
          const { error } = await admin
            .from('subscriptions')
            .update({
              status: subscriptionUpdated.status,
              current_period_end: new Date(
                (subscriptionUpdated as any).current_period_end * 1000
              ).toISOString(),
              cancel_at_period_end: subscriptionUpdated.cancel_at_period_end,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionUpdated.id);
          if (error) console.error('Failed to update subscription:', error);
        } catch (e) {
          console.warn('Supabase admin unavailable for subscription update:', e);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        console.log('Subscription deleted:', subscriptionDeleted.id);
        try {
          const admin = await getSupabaseAdmin();
          const { error } = await admin
            .from('subscriptions')
            .update({
              status: 'cancelled',
              cancelled_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionDeleted.id);
          if (error) console.error('Failed to cancel subscription:', error);
        } catch (e) {
          console.warn('Supabase admin unavailable for subscription deletion:', e);
        }
        break;
      }

      // ── Invoices ───────────────────────────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment succeeded for invoice:', invoice.id);
        await persistInvoice(invoice, 'paid');
        break;
      }

      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('Payment failed for invoice:', failedInvoice.id);
        await persistInvoice(failedInvoice, 'failed');

        // Notify user about the failed payment
        try {
          const admin = await getSupabaseAdmin();
          const customerId =
            typeof failedInvoice.customer === 'string'
              ? failedInvoice.customer
              : failedInvoice.customer?.id;
          const { data: profile } = await admin
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (profile?.id) {
            await admin.from('notifications').insert({
              user_id: profile.id,
              title: 'Payment Failed',
              message: `Your payment of €${((failedInvoice.amount_due ?? 0) / 100).toFixed(2)} could not be processed. Please update your payment method.`,
              type: 'error',
              is_read: false,
              created_at: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn('Failed to send payment failure notification:', e);
        }
        break;
      }

      case 'invoice.voided': {
        const voidedInvoice = event.data.object as Stripe.Invoice;
        console.log('Invoice voided:', voidedInvoice.id);
        await persistInvoice(voidedInvoice, 'voided');
        break;
      }

      // ── Payment Intents ────────────────────────────────────────
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntent.id);

        const { metadata, amount } = paymentIntent;
        const piType = metadata.type;
        const piUserId = metadata.userId;

        if (piType === 'wallet_topup' && piUserId) {
          const amountCredits = parseFloat(metadata.amountCredits || '0');
          const amountPaid = amount / 100;
          if (amountCredits > 0) {
            try {
              const { walletService } = await import('@/lib/platform/services/wallet-service');
              await walletService.processStripeTopUp(
                piUserId,
                amountCredits,
                paymentIntent.id,
                amountPaid
              );
              console.log(`Processed wallet top-up for user ${piUserId}: ${amountCredits} credits`);
            } catch (e) {
              console.warn('Wallet service unavailable during top-up processing:', e);
            }
          }
        } else if (piType === 'session_prepayment' && metadata.bookingId) {
          try {
            const admin = await getSupabaseAdmin();
            const bookingId = metadata.bookingId;
            const { error } = await admin
              .from('bookings')
              .update({
                payment_status: 'paid',
                stripe_payment_intent_id: paymentIntent.id,
                amount_paid: amount / 100,
                updated_at: new Date().toISOString(),
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
      }

      // ── Refunds ────────────────────────────────────────────────
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('Charge refunded:', charge.id);
        try {
          const admin = await getSupabaseAdmin();
          const paymentIntentId =
            typeof charge.payment_intent === 'string'
              ? charge.payment_intent
              : charge.payment_intent?.id;

          // Update any booking linked to this payment intent
          if (paymentIntentId) {
            await admin
              .from('bookings')
              .update({
                payment_status: 'refunded',
                updated_at: new Date().toISOString(),
              })
              .eq('stripe_payment_intent_id', paymentIntentId);
          }

          // Log the refund transaction
          const customerId =
            typeof charge.customer === 'string' ? charge.customer : charge.customer?.id;
          const { data: profile } = await admin
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (profile?.id) {
            await admin.from('billing_transactions').insert({
              client_id: profile.id,
              amount_eur: -(charge.amount_refunded / 100),
              type: 'refund',
              note: `Refund for charge ${charge.id}`,
              created_at: new Date().toISOString(),
            });

            await admin.from('notifications').insert({
              user_id: profile.id,
              title: 'Refund Processed',
              message: `A refund of €${(charge.amount_refunded / 100).toFixed(2)} has been processed to your payment method.`,
              type: 'success',
              is_read: false,
              created_at: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn('Failed to process refund:', e);
        }
        break;
      }

      // ── Disputes ───────────────────────────────────────────────
      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        console.log('Dispute created:', dispute.id);
        try {
          const admin = await getSupabaseAdmin();
          // Notify admins about the dispute
          const { data: admins } = await admin.from('profiles').select('id').eq('role', 'admin');

          for (const adminUser of admins ?? []) {
            await admin.from('notifications').insert({
              user_id: adminUser.id,
              title: 'Payment Dispute Received',
              message: `A dispute for €${(dispute.amount / 100).toFixed(2)} (${dispute.reason}) requires attention.`,
              type: 'warning',
              is_read: false,
              created_at: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn('Failed to notify about dispute:', e);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
