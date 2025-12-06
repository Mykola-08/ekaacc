import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { verifyManageToken, signManageToken, hashToken } from '@/lib/bookingToken';
import Stripe from 'stripe';
import { emitEvent } from '@/lib/events';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

// POST /api/booking/:id/cancel
// Body: { manageToken }
// Applies cancellation policy and sets status/payment_status accordingly (refund logic stub)
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
    if (booking.status !== 'scheduled') {
      return NextResponse.json({ error: 'Cannot cancel booking in current status' }, { status: 409 });
    }

    const start = new Date(booking.start_time);
    const now = new Date();
    const diffHours = (start.getTime() - now.getTime()) / 3600000;
    const policy = booking.cancellation_policy || { deadlineOffsetHours: 24, refundPercent: 0, feeCents: 0 };
    let refundablePercent = 0;
    if (diffHours >= policy.deadlineOffsetHours) {
      refundablePercent = policy.refundPercent;
    }
    // Refund stub: real implementation would call Stripe API to issue refund if captured.
    const amountBasis = booking.payment_mode === 'deposit' ? booking.deposit_cents : booking.base_price_cents + (booking.addons_json || []).reduce((s: number, a: any) => s + (a.priceCents || 0), 0);
    const refundCents = Math.round(amountBasis * (refundablePercent / 100));

    // Attempt Stripe refund if captured
    if (refundCents > 0 && booking.payment_status === 'captured' && booking.stripe_payment_intent) {
      try {
        await stripe.refunds.create({ payment_intent: booking.stripe_payment_intent, amount: refundCents });
      } catch (err: any) {
        return NextResponse.json({ error: 'Refund failed: ' + err.message }, { status: 500 });
      }
    }

    const newPaymentStatus = refundCents > 0 ? 'refunded' : booking.payment_status;
    const { error: updateErr } = await supabase
      .from('booking')
      .update({ status: 'canceled', payment_status: newPaymentStatus })
      .eq('id', booking.id);
    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

    // Rotate manage token
    const newToken = await signManageToken(booking.id, 'manage', 900);
    const { error: rotateErr } = await supabase
      .from('booking')
      .update({ manage_token_hash: hashToken(newToken) })
      .eq('id', booking.id);
    if (rotateErr) {
      return NextResponse.json({ error: rotateErr.message }, { status: 500 });
    }

    await emitEvent('booking.canceled', { bookingId: booking.id, refundCents });
    return NextResponse.json({ bookingId: booking.id, status: 'canceled', refundCents, manageToken: newToken });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
