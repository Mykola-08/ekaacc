import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { verifyManageToken, signManageToken, hashToken } from '@/lib/bookingToken';

// POST /api/booking/:id/reschedule
// Body: { manageToken, newStartTime }
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { manageToken, newStartTime } = await req.json();
    if (!manageToken || !newStartTime) {
      return NextResponse.json({ error: 'Missing manageToken or newStartTime' }, { status: 400 });
    }
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
      return NextResponse.json({ error: 'Cannot reschedule in current status' }, { status: 409 });
    }

    // Policy check (same as cancellation window for simplicity)
    const start = new Date(booking.start_time);
    const now = new Date();
    const diffHours = (start.getTime() - now.getTime()) / 3600000;
    const policy = booking.cancellation_policy || { deadlineOffsetHours: 24 };
    if (diffHours < policy.deadlineOffsetHours) {
      return NextResponse.json({ error: 'Reschedule window closed' }, { status: 403 });
    }

    const newStart = new Date(newStartTime);
    if (isNaN(newStart.getTime())) {
      return NextResponse.json({ error: 'Invalid newStartTime' }, { status: 400 });
    }
    const newEnd = new Date(newStart.getTime() + booking.duration_minutes * 60000);

    // Overlap check same service
    const { data: overlapping, error: overlapErr } = await supabase
      .from('booking')
      .select('id,start_time,end_time')
      .eq('service_id', booking.service_id)
      .filter('start_time', 'lt', newEnd.toISOString())
      .filter('end_time', 'gt', newStart.toISOString())
      .neq('id', booking.id);
    if (overlapErr) return NextResponse.json({ error: overlapErr.message }, { status: 500 });
    if (overlapping && overlapping.length > 0) {
      return NextResponse.json({ error: 'New slot unavailable' }, { status: 409 });
    }

    // Price delta logic (assume unchanged; placeholder for future variant changes)
    const priceDeltaCents = 0;
    const { error: updateErr } = await supabase
      .from('booking')
      .update({ start_time: newStart.toISOString(), end_time: newEnd.toISOString() })
      .eq('id', booking.id);
    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

    const newToken = await signManageToken(booking.id, 'manage', 900);
    const { error: rotateErr } = await supabase
      .from('booking')
      .update({ manage_token_hash: hashToken(newToken) })
      .eq('id', booking.id);
    if (rotateErr) return NextResponse.json({ error: rotateErr.message }, { status: 500 });

    return NextResponse.json({ bookingId: booking.id, newStartTime: newStart.toISOString(), newEndTime: newEnd.toISOString(), priceDeltaCents, manageToken: newToken });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
