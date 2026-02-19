import { createClient } from '@/lib/platform/supabase/server';
import { BroadcastService } from '@/lib/platform/services/broadcast-service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  // Check admin role
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'Admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { subject, content, groupId, topic, templateData } = (await request.json()) as any;

  try {
    const result = await BroadcastService.sendBroadcast(
      subject,
      content,
      topic || 'general',
      groupId,
      user.id,
      templateData
    );
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Broadcast error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
