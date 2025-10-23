import { NextRequest, NextResponse } from 'next/server';
import { listBookings } from '@/server/square-client';

function normalizePhone(value?: string | null): string | null {
  if (!value) return null;
  return value.replace(/\D+/g, '');
}

function normalizeBooking(raw: any) {
  const appointment = Array.isArray(raw?.appointmentSegments) ? raw.appointmentSegments[0] : undefined;
  const locationId = raw?.locationId ?? raw?.location_id ?? appointment?.locationId;
  const customer = raw?.customer ?? raw?.customerDetails ?? raw?.customer_details;
  const customerEmail = customer?.emailAddress ?? customer?.email_address ?? raw?.customerEmailAddress ?? raw?.customerEmail;
  const customerPhone = customer?.phoneNumber ?? customer?.phone_number ?? raw?.customerPhoneNumber ?? raw?.customerPhone;
  const startAt = raw?.startAt ?? raw?.start_at ?? appointment?.startAt ?? appointment?.start_at ?? raw?.createdAt ?? raw?.created_at;
  const serviceName = appointment?.serviceVariation?.name ?? appointment?.serviceVariationName ?? appointment?.serviceVariationId;
  const therapistId = appointment?.teamMemberId ?? appointment?.team_member_id ?? raw?.sellerStaffId ?? raw?.seller_staff_id;

  return {
    id: raw?.id ?? raw?.bookingId ?? raw?.booking_id ?? `square-booking-${Math.random().toString(36).slice(2)}`,
    userId: raw?.customerId ?? raw?.customer_id ?? customer?.id ?? customer?.customerId ?? null,
    therapistId: therapistId ?? null,
    date: startAt ? new Date(startAt).toISOString() : new Date().toISOString(),
    status: (raw?.status ?? 'unknown').toString().toLowerCase(),
    source: 'square' as const,
    locationId: locationId ?? null,
    serviceName: serviceName ?? null,
    customerEmail: customerEmail ?? null,
    customerPhone: customerPhone ?? null,
    durationMinutes: appointment?.durationMinutes ?? appointment?.duration_minutes ?? null,
    raw,
  };
}

function matchesFilters(
  booking: ReturnType<typeof normalizeBooking>,
  filters: { email?: string | null; phone?: string | null; userId?: string | null }
) {
  const { email, phone, userId } = filters;
  if (email) {
    const bookingEmail = booking.customerEmail?.toLowerCase();
    if (!bookingEmail || bookingEmail !== email.toLowerCase()) {
      return false;
    }
  }

  if (phone) {
    const targetPhone = normalizePhone(phone);
    if (targetPhone) {
      const bookingPhone = normalizePhone(booking.customerPhone);
      if (!bookingPhone || !bookingPhone.includes(targetPhone)) {
        return false;
      }
    }
  }

  if (userId) {
    if (!booking.userId || booking.userId !== userId) {
      return false;
    }
  }

  return true;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limitParam = Number.parseInt(searchParams.get('limit') ?? '20', 10);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 20;
  const email = searchParams.get('email')?.trim() || undefined;
  const phone = searchParams.get('phone')?.trim() || undefined;
  const userId = searchParams.get('userId')?.trim() || undefined;

  try {
    const bookings = await listBookings(limit);
    const normalized = bookings.map(normalizeBooking);
    const filtered = normalized.filter((booking: ReturnType<typeof normalizeBooking>) =>
      matchesFilters(booking, { email, phone, userId })
    );

    return NextResponse.json({
      bookings: (filtered.length ? filtered : normalized).slice(0, limit),
      count: filtered.length || normalized.length,
      filterApplied: Boolean(email || phone || userId),
    });
  } catch (error: any) {
    const message = error?.message || 'Unknown Square error';
    const status = message.includes('not configured') ? 503 : 500;
    return NextResponse.json(
      {
        error: 'Square integration unavailable',
        details: message,
      },
      { status }
    );
  }
}
