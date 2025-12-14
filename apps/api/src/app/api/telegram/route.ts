import { bot } from '@/lib/bot';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
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
