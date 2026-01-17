import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { updateBookingPaymentStatus } from '@/server/booking/service';
import { LoyaltyService } from '@/server/loyalty/service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.client_reference_id;
        const paymentIntentId = session.payment_intent as string;

        if (bookingId) {
            await updateBookingPaymentStatus(bookingId, 'captured', paymentIntentId);

            // Loyalty Logic: 1 Euro = 1 Point
            try {
              const { data: booking } = await supabaseAdmin
                .from('booking')
                .select('customer_reference_id')
                .eq('id', bookingId)
                .single();

              if (booking?.customer_reference_id) {
                const amountPaid = session.amount_total || 0;
                if (amountPaid > 0) {
                  const pointsEarned = Math.floor(amountPaid / 100); // 1 point per 100 cents (1 EUR)
                  
                  const loyalty = new LoyaltyService(supabaseAdmin);
                  await loyalty.addPoints(
                    booking.customer_reference_id,
                    pointsEarned,
                    'earned_booking',
                    bookingId,
                    `Points earned from booking ${bookingId}`
                  );
                }
              }
            } catch (loyaltyError) {
              console.error('Failed to award loyalty points:', loyaltyError);
              // Do not fail the webhook, just log the error
            }
        }
        break;
      }
      case 'checkout.session.expired': {
         const session = event.data.object as Stripe.Checkout.Session;
         const bookingId = session.client_reference_id;
         if (bookingId) {
             // Potentially cancel the tentative booking if logic requires
             // await updateBookingPaymentStatus(bookingId, 'failed');
         }
         break;
      }
      // Add other event types as needed
      default:
        // Unhandled event type
        break;
    }
  } catch (err: any) {
      console.error('Error processing webhook:', err);
      return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
