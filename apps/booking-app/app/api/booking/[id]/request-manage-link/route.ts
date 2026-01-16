import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { signManageToken, hashToken } from '@/lib/bookingToken';

// POST /api/booking/:id/request-manage-link
// Body: { email }
// Issues a new manage token if email matches booking
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    const supabase = await createClient();
    const { data: booking, error } = await supabase
      .from('booking')
      .select('id,email')
      .eq('id', id)
      .single();
    if (error || !booking) return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 });
    if (booking.email !== email) return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
    const token = await signManageToken(booking.id, 'manage', 900);
    const { error: updErr } = await supabase
      .from('booking')
      .update({ manage_token_hash: hashToken(token) })
      .eq('id', booking.id);
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
    return NextResponse.json({ bookingId: booking.id, manageToken: token });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
