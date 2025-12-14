import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { verifyManageToken } from '@/lib/bookingToken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-11-17.clover',
});

// POST /api/booking/:id/pay
// Body: { manageToken }
// Creates Stripe Checkout session for remaining amount (full or deposit already determined on booking)
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { manageToken } = await req.json();
    if (!manageToken) return NextResponse.json({ error: 'Missing manageToken' }, { status: 400 });
    const payload = await verifyManageToken(manageToken);
    if (!payload || payload.bookingId !== id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    const supabase = await createClient();
    const { data: booking, error: bookingErr } = await supabase
      .from('booking')
      .select('*')
      .eq('id', id)
      .single();
    if (bookingErr || !booking) {
      return NextResponse.json({ error: bookingErr?.message || 'Booking not found' }, { status: 404 });
    }
    if (booking.payment_status !== 'pending') {
      return NextResponse.json({ error: 'Payment already processed or not allowed' }, { status: 409 });
    }
    // Amount logic
    const base = booking.base_price_cents;
    const addonsTotal = (booking.addons_json || []).reduce((sum: number, a: any) => sum + (a.priceCents || 0), 0);
    const total = base + addonsTotal;
    const amountToCharge = booking.payment_mode === 'deposit' ? booking.deposit_cents : total;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: booking.currency || 'usd',
            product_data: { name: booking.display_name ? `${booking.display_name}'s booking` : 'Booking Payment' },
            unit_amount: amountToCharge,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?booking_id=${booking.id}`,
      cancel_url: `${req.headers.get('origin')}/booking-cancelled?booking_id=${booking.id}`,
      customer_email: booking.email,
      metadata: {
        bookingId: booking.id,
        paymentMode: booking.payment_mode,
      },
    });

    // Optionally update status to authorized (Stripe will webhook capture) - keep pending until success
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
