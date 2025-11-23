import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import type { Service } from '@/types/database';
import type { AvailabilityResponse, AvailabilitySlot } from '@/types/booking';

// Simple mock availability generation: working hours 09:00-17:00 local, slots aligned to service duration.
// Future: incorporate staff schedules, existing bookings, buffers, blackout windows.

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(req.url);
  const date = url.searchParams.get('date');
  if (!date) {
    return NextResponse.json({ error: 'Missing date (YYYY-MM-DD)' }, { status: 400 });
  }

  const supabase = await createClient();

  // Fetch service to get duration
  const { data: service, error } = await supabase
    .from('service')
    .select('id,duration,name')
    .eq('id', id)
    .single();

  if (error || !service) {
    return NextResponse.json({ error: error?.message || 'Service not found' }, { status: 404 });
  }

  const durationMin = service.duration;
  const weekday = new Date(date + 'T00:00:00').getDay();

  // Fetch staff with schedule for this weekday
  const { data: schedules, error: schedErr } = await supabase
    .from('staff_schedule')
    .select('staff_id,start_hour,end_hour,active')
    .eq('weekday', weekday)
    .eq('active', true);
  if (schedErr) return NextResponse.json({ error: schedErr.message }, { status: 500 });

  // Fetch existing bookings for service on that date (any staff)
  const dayStart = new Date(date + 'T00:00:00Z');
  const dayEnd = new Date(dayStart.getTime() + 86400000);
  const { data: bookings, error: bookErr } = await supabase
    .from('booking')
    .select('id,start_time,end_time,staff_id,payment_status')
    .eq('service_id', service.id)
    .gte('start_time', dayStart.toISOString())
    .lt('end_time', dayEnd.toISOString());
  if (bookErr) return NextResponse.json({ error: bookErr.message }, { status: 500 });

  const slots: AvailabilitySlot[] = [];
  for (const sched of schedules || []) {
    const staffId = sched.staff_id;
    for (let hour = sched.start_hour; hour < sched.end_hour; hour++) {
      const start = new Date(date + 'T00:00:00');
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start.getTime() + durationMin * 60000);
      if (end.getHours() > sched.end_hour || (end.getHours() === sched.end_hour && end.getMinutes() > 0)) {
        break;
      }
      // Overlap check for staff
      const overlapping = (bookings || []).some(b => b.staff_id === staffId && new Date(b.start_time) < end && new Date(b.end_time) > start && ['pending','authorized','captured'].includes(b.payment_status));
      if (!overlapping) {
        slots.push({ startTime: start.toISOString(), endTime: end.toISOString(), staffId });
      }
    }
  }

  const response: AvailabilityResponse = {
    serviceId: service.id,
    date,
    slots,
    generatedAt: new Date().toISOString(),
    durationMinutes: durationMin,
  };

  return NextResponse.json(response);
}
