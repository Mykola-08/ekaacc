import { createClient } from '@/lib/supabase/admin'; // Use Admin client for webhook
import { NextResponse } from 'next/server';

const TELEGRAM_SECRET_TOKEN = process.env.TELEGRAM_SECRET_TOKEN;

export async function POST(req: Request) {
  // 1. Verify Secret Token
  const token = req.headers.get('x-telegram-bot-api-secret-token');
  if (token !== TELEGRAM_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const update = await req.json();
  const supabase = createClient();

  // 2. Handle Message
  if (update.message) {
    const { chat, text, from } = update.message;
    const userId = from.id; // Telegram User ID

    // Command: /link [code]
    if (text?.startsWith('/link')) {
      const code = text.split(' ')[1];
      if (code) {
        // Find user with this verification code
        const { data: link, error } = await supabase
          .from('telegram_links')
          .select('id, user_id')
          .eq('verification_code', code)
          .eq('is_verified', false)
          .single();

        if (link) {
          // Link Success
          await supabase.from('telegram_links').update({
            telegram_chat_id: chat.id,
            telegram_username: from.username,
            is_verified: true,
            verification_code: null // consume code
          }).eq('id', link.id);

          await sendTelegramMessage(chat.id, "✅ Account linked successfully! You will now receive notifications here.");
        } else {
          await sendTelegramMessage(chat.id, "❌ Invalid or expired link code.");
        }
      }
    }

    // Handle Chat Sync (if in a group linked to a channel)
    // ... (Future expansion: map chat.id to channel_id and insert into chat_messages)
  }

  return NextResponse.json({ ok: true });
}

async function sendTelegramMessage(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}
