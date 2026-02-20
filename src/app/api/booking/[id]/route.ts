import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { verifyManageToken } from '@/lib/bookingToken';

// GET /api/booking/:id?token=...
// Returns minimal public booking view if token valid
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  const payload = await verifyManageToken(token);
  if (!payload || payload.bookingId !== id) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
  const supabase = await createClient();
  const { data: booking, error } = await supabase
    .from('booking')
    .select(
      'id,start_time,end_time,status,payment_status,email,display_name,service_id,addons_json,payment_mode,deposit_cents,base_price_cents,currency,cancellation_policy'
    )
    .eq('id', id)
    .single();
  if (error || !booking)
    return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 });
  return NextResponse.json({ booking });
}
