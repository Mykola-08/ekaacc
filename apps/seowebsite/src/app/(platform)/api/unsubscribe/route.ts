import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { uid } = await request.json() as any;

  if (!uid) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  // In a real app, verify signature here to prevent unauthorized unsubscription
  
  // Re-initializing with service role for this operation
  const { createClient: createServiceClient } = await import('@supabase/supabase-js');
  const adminClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rbnfyxhewsivofvwdpuk.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await adminClient
    .from('user_notification_settings')
    .upsert({ 
        user_id: uid, 
        marketing_email: false 
    }, { onConflict: 'user_id' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
