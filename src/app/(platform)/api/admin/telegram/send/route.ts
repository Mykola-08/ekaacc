import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { hasPermission } from '@/lib/permissions';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check Permissions
  const canSend = await hasPermission(user.id, 'telegram.send');
  if (!canSend) {
    return NextResponse.json(
      { error: 'Forbidden: Missing telegram.send permission' },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { chatId, message } = body;

  if (!chatId || !message) {
    return NextResponse.json({ error: 'Missing chatId or message' }, { status: 400 });
  }

  // Send via Telegram API
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  const result = await response.json();

  if (!result.ok) {
    return NextResponse.json({ error: result.description }, { status: 500 });
  }

  return NextResponse.json({ success: true, result });
}
