import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import { v4 as uuid } from 'uuid';
import { signManageToken, hashToken } from '@/lib/bookingToken';
import { emitEvent } from '@/lib/events';

// POST /api/booking
// Body: { serviceId, startTime (ISO), email, phone?, displayName?, paymentMode: 'full'|'deposit', depositCents?, addons?: [{addonId,name,priceCents}] }
// Creates pending booking with reservation TTL (5m) and returns manage token
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const {
      serviceId,
      startTime,
      email,
      phone,
      displayName,
      paymentMode,
      depositCents = 0,
      addons = [],
      staffId,
    } = body;

    if (!serviceId || !startTime || !email || !paymentMode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch service info
    const { data: service, error: serviceErr } = await supabase
      .from('service')
      .select('id,name,price,duration')
      .eq('id', serviceId)
      .single();
    if (serviceErr || !service) {
      return NextResponse.json({ error: serviceErr?.message || 'Service not found' }, { status: 404 });
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      return NextResponse.json({ error: 'Invalid startTime' }, { status: 400 });
    }
    const end = new Date(start.getTime() + service.duration * 60000);

    // Basic overlap check (pending + confirmed)
    const { data: overlapping, error: overlapErr } = await supabase
      .from('booking')
      .select('id,start_time,end_time,payment_status,staff_id')
      .eq('service_id', service.id)
      .or(`payment_status.eq.pending,payment_status.eq.captured,payment_status.eq.authorized`)
      .filter('start_time', 'lt', end.toISOString())
      .filter('end_time', 'gt', start.toISOString());
    if (overlapErr) {
      return NextResponse.json({ error: overlapErr.message }, { status: 500 });
    }
    if (overlapping && overlapping.length > 0) {
      return NextResponse.json({ error: 'Slot just taken', alternatives: [] }, { status: 409 });
    }

    // Auto-assign staff if not provided
    let finalStaffId = staffId || null;
    if (!finalStaffId) {
      const weekday = start.getDay();
      const startHour = start.getHours();
      const { data: schedules } = await supabase
        .from('staff_schedule')
        .select('staff_id,start_hour,end_hour,active')
        .eq('weekday', weekday)
        .eq('active', true);
      if (schedules) {
        for (const s of schedules) {
          const durationHours = service.duration / 60;
          if (startHour >= s.start_hour && (startHour + durationHours) <= s.end_hour) {
            const staffOverlap = (overlapping || []).some(b => b.staff_id === s.staff_id);
            if (!staffOverlap) {
              finalStaffId = s.staff_id;
              break;
            }
          }
        }
      }
    }

    const reservationTTLMinutes = 5;
    const reservationExpiresAt = new Date(Date.now() + reservationTTLMinutes * 60000);

    const id = uuid();
    const manageToken = await signManageToken(id, 'manage', reservationTTLMinutes * 60); // initial short token
    const manageTokenHash = hashToken(manageToken);

    const basePriceCents = Math.round(service.price * 100);
    const addonsTotal = addons.reduce((sum: number, a: any) => sum + (a.priceCents || 0), 0);
    const totalCents = basePriceCents + addonsTotal;
    if (paymentMode === 'deposit' && depositCents <= 0) {
      return NextResponse.json({ error: 'Deposit amount required for deposit mode' }, { status: 400 });
    }

    const cancellationPolicy = {
      deadlineOffsetHours: 24,
      refundPercent: 50,
      feeCents: 0,
    };

    const insertPayload = {
      id,
      service_id: service.id,
      staff_id: finalStaffId,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      duration_minutes: service.duration,
      base_price_cents: basePriceCents,
      currency: 'EUR',
      email,
      phone,
      display_name: displayName,
      addons_json: addons,
      payment_mode: paymentMode,
      deposit_cents: paymentMode === 'deposit' ? depositCents : 0,
      payment_status: 'pending',
      status: 'scheduled',
      cancellation_policy: cancellationPolicy,
      reservation_expires_at: reservationExpiresAt.toISOString(),
      manage_token_hash: manageTokenHash,
    };

    const { error: insertErr } = await supabase.from('booking').insert(insertPayload);
    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    await emitEvent('booking.created', { bookingId: id, serviceId: service.id, startTime, staffId: finalStaffId });

    return NextResponse.json({
      bookingId: id,
      manageToken,
      totalCents,
      basePriceCents,
      addonsTotalCents: addonsTotal,
      depositCents: paymentMode === 'deposit' ? depositCents : undefined,
      reservationExpiresAt: reservationExpiresAt.toISOString(),
      staffId: finalStaffId,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
