/**
 * AI Conversations API
 *
 * GET  /api/ai/conversations          – list conversations
 * GET  /api/ai/conversations?id=xxx   – get messages for a conversation
 * DELETE /api/ai/conversations?id=xxx – delete a conversation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { conversationService } from '@/server/ai';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversationId = req.nextUrl.searchParams.get('id');

  if (conversationId) {
    const messages = await conversationService.getMessages(conversationId);
    return NextResponse.json({ messages });
  }

  const conversations = await conversationService.list(user.id);
  return NextResponse.json({ conversations });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversationId = req.nextUrl.searchParams.get('id');
  if (!conversationId) {
    return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
  }

  await conversationService.delete(conversationId, user.id);
  return NextResponse.json({ success: true });
}
