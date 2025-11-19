import { createClient } from '@/lib/supabase/server';
import { BroadcastService } from '@/services/broadcast-service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Check admin role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'Admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { subject, content, groupId } = await request.json();

  try {
    const result = await BroadcastService.sendBroadcast(
      subject,
      content,
      groupId,
      user.id
    );
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Broadcast error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
