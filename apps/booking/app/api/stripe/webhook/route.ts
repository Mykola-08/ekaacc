import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabaseClient';
import { emitEvent } from '@/lib/events';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-11-17.clover',
});

// POST /api/stripe/webhook
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }
  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: 'Webhook signature verification failed: ' + err.message }, { status: 400 });
  }

  const supabase = await createClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      const paymentIntent = session.payment_intent as string | null;
      const { error: updErr } = await supabase
        .from('booking')
        .update({ payment_status: 'captured', stripe_payment_intent: paymentIntent })
        .eq('id', bookingId);
      if (updErr) {
        await emitEvent('payment.capture.failed', { bookingId, reason: updErr.message });
      } else {
        await emitEvent('payment.captured', { bookingId, paymentIntent });
      }
    }
  } else if (event.type === 'checkout.session.async_payment_failed' || event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      const { error: updErr } = await supabase
        .from('booking')
        .update({ payment_status: 'canceled' })
        .eq('id', bookingId);
      if (!updErr) await emitEvent('payment.failed', { bookingId });
    }
  }

  return NextResponse.json({ received: true });
}
