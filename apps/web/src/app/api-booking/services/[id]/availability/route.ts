import { NextResponse } from 'next/server';
import { getServiceAvailability } from '@/server/booking/service';

// Simple mock availability generation: working hours 09:00-17:00 local, slots aligned to service duration.
// Future: incorporate staff schedules, existing bookings, buffers, blackout windows.

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(req.url);
  const date = url.searchParams.get('date');
  const variantId = url.searchParams.get('variantId') || undefined;

  if (!date) {
    return NextResponse.json({ error: 'Missing date (YYYY-MM-DD)' }, { status: 400 });
  }

  const result = await getServiceAvailability(id, date, variantId);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status || 500 });
  }

  return NextResponse.json(result.data);
}
