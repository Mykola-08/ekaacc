import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/server/payment/service';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_ORIGINS = [
  'https://ekabalance.com',
  'https://www.ekabalance.com',
  'https://therapist.ekabalance.com',
  'https://admin.ekabalance.com',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:9002'] : []),
];

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const rawOrigin = req.headers.get('origin') || new URL(req.url).origin;
    const origin = ALLOWED_ORIGINS.includes(rawOrigin) ? rawOrigin : ALLOWED_ORIGINS[0];

    const result = await createCheckoutSession({
      ...body,
      origin,
      userId: user.id, // Explicitly pass the validated user ID to the service
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (err) {
    console.error('Error in checkout route:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json(
      { error: 'An error occurred processing your payment. Please try again.' },
      { status: 500 }
    );
  }
}
