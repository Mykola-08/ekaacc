import { bot } from '@/lib/platform/services/bot-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const secretToken = req.headers.get('x-telegram-bot-api-secret-token');
    if (secretToken !== process.env.TELEGRAM_SECRET_TOKEN) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!bot) {
        return NextResponse.json({ ok: false, error: 'Bot not initialized' }, { status: 500 });
    }
    const body = await req.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error handling update', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(_req: NextRequest) {
    return NextResponse.json({ ok: true, message: 'Telegram Bot API is running' });
}
