import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

export async function POST(request: Request) {
  const body = (await request.json()) as { uid?: string; signature?: string; timestamp?: string };
  const { uid, signature, timestamp } = body;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!uid) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Supabase credentials are not configured' }, { status: 500 });
  }

  // Verify HMAC signature to prevent unauthorized unsubscription
  const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET || serviceRoleKey;
  if (!signature || !timestamp) {
    return NextResponse.json({ error: 'Missing signature or timestamp' }, { status: 400 });
  }

  // Prevent replay attacks: timestamp must be within 10 minutes
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Math.abs(Date.now() - ts) > 600_000) {
    return NextResponse.json({ error: 'Request expired' }, { status: 400 });
  }

  const expectedSig = createHmac('sha256', unsubscribeSecret)
    .update(`${uid}:${timestamp}`)
    .digest('hex');

  try {
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSig, 'hex');
    if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  // Re-initializing with service role for this operation
  const { createClient: createServiceClient } = await import('@supabase/supabase-js');
  const adminClient = createServiceClient(supabaseUrl, serviceRoleKey);

  const { error } = await adminClient.from('user_notification_settings').upsert(
    {
      user_id: uid,
      marketing_email: false,
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
