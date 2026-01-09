import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { verifyManageToken } from '@/lib/bookingToken';
import { emitEvent } from '@/lib/events';

// POST /api/booking/:id/pay
// Body: { manageToken }
// Bypasses Stripe and directly confirms payment for the booking
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
    
    // Simulate successful payment capture
    const { error: updErr } = await supabase
      .from('booking')
      .update({ 
        payment_status: 'captured', 
        stripe_payment_intent: 'manual_bypass_pay_route' 
      })
      .eq('id', booking.id);
      
    if (updErr) {
      console.error('Failed to update booking status:', updErr);
      return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
    }

    await emitEvent('payment.captured', { bookingId: booking.id, paymentIntent: 'manual_bypass_pay_route' });

    const origin = req.headers.get('origin') || '';
    const successUrl = `${origin}/success?booking_id=${booking.id}&session_id=manual_pay_${booking.id}`;

    return NextResponse.json({ sessionId: `manual_pay_${booking.id}`, url: successUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

