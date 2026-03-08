import { NextResponse } from 'next/server';
import { createBooking } from '@/server/booking/service';
import { z } from 'zod';

// Simple in-memory rate limiter (per-IP, 5 requests per 60 seconds)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  startTime: z.string().datetime(),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  displayName: z.string().max(200).optional(),
  paymentMode: z.enum(['full', 'deposit']),
  depositCents: z.number().int().min(0).optional(),
  addons: z
    .array(
      z.object({
        addonId: z.string(),
        name: z.string(),
        priceCents: z.number().int().min(0),
      })
    )
    .optional(),
});

// POST /api/booking
export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many booking requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await req.json();

    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await createBooking(parsed.data);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 500 });
    }

    return NextResponse.json(result.data);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
