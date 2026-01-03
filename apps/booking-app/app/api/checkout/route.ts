import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/server/payment/service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const origin = req.headers.get('origin') || '';
    
    const result = await createCheckoutSession({
      ...body,
      origin
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (err: any) {
    console.error('Error in checkout route:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
