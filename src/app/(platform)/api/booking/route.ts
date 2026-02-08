import { NextResponse } from 'next/server';
import { createBooking } from '@/server/booking/service';

// POST /api/booking
// Body: { serviceId, startTime (ISO), email, phone?, displayName?, paymentMode: 'full'|'deposit', depositCents?, addons?: [{addonId,name,priceCents}] }
// Creates pending booking with reservation TTL (5m) and returns manage token
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Pass detailed body for validation in service layer
    const result = await createBooking(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 500 });
    }

    return NextResponse.json(result.data);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

