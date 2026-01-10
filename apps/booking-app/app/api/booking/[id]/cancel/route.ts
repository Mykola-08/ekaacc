import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { verifyManageToken, signManageToken, hashToken } from '@/lib/bookingToken';
import { emitEvent } from '@/lib/events';

// POST /api/booking/:id/cancel
// Body: { manageToken }
// Applies cancellation policy and sets status/payment_status accordingly
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
    // Logic for amount calculation remains for record keeping
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const amountBasis = booking.payment_mode === 'deposit' ? booking.deposit_cents : booking.base_price_cents + (booking.addons_json || []).reduce((s: number, a: any) => s + (a.priceCents || 0), 0);
    const refundCents = Math.round(amountBasis * (refundablePercent / 100));

    // Stripe refund removed. 
    // In a real scenario without Stripe, this would be a manual refund or store credit.
    console.log(`Skipping automatic refund of ${refundCents} cents for booking ${booking.id}`);

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
