import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call the RPC function for atomic wallet payment
    const { data, error } = await supabase.rpc('pay_booking_with_wallet', {
      p_booking_id: bookingId,
      p_user_id: user.id,
    });

    if (error) {
      console.error('Wallet payment error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Success
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Wallet payment exception:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
