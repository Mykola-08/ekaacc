import { NextRequest, NextResponse } from 'next/server';
import { telegramBot } from '@/server/telegram/bot-service';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        // Hand off to service
        await telegramBot.handleUpdate(body);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Telegram Webhook Error:", error);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}

