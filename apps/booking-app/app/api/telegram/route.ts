import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET; // Optional security

// Helper to send message to Telegram
async function sendTelegramMessage(chatId: number, text: string, replyMarkup?: any) {
    if (!TELEGRAM_BOT_TOKEN) return;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            reply_markup: replyMarkup
        })
    });
}

export async function POST(req: NextRequest) {
    // 1. Verify Request (Basic check)
    if (!TELEGRAM_BOT_TOKEN) {
        console.error("Missing TELEGRAM_BOT_TOKEN");
        return NextResponse.json({ error: 'Config error' }, { status: 500 });
    }

    const body = await req.json();

    // 2. Extract Message Info
    const message = body.message || body.edited_message;
    if (!message) return NextResponse.json({ ok: true }); // Ignore non-messages

    const chatId = message.chat.id;
    const text = message.text || '';
    const username = message.from.username;
    const telegramUserId = message.from.id;

    // 3. Handle Chat Member Updates (Bot added/removed from group)
    if (body.my_chat_member) {
        const update = body.my_chat_member;
        const newStatus = update.new_chat_member.status;
        const chat = update.chat;
        const supabase = await createClient();

        if (['member', 'administrator'].includes(newStatus)) {
            // Bot added
            await supabase.from('telegram_chats').upsert({
                chat_id: chat.id,
                title: chat.title || 'Untitled Group',
                type: chat.type,
                is_active: true,
                updated_at: new Date().toISOString()
            });
        } else if (['left', 'kicked'].includes(newStatus)) {
            // Bot removed (mark inactive)
            await supabase.from('telegram_chats').update({ is_active: false }).eq('chat_id', chat.id);
        }
        return NextResponse.json({ ok: true });
    }

    // 4. Command Routing
    if (text.startsWith('/start')) {
        // Handle Start: Check if linked, if not provide link code/instructions
        const supabase = await createClient();

        // Upsert telegram link table tracking (unverified first)
        await supabase.from('telegram_links').upsert({
            telegram_chat_id: chatId,
            telegram_username: username,
            // We can't automatically link to Supabase Auth user without a flow.
            // For now, just welcome them.
        }, { onConflict: 'telegram_chat_id' });

        await sendTelegramMessage(chatId,
            `<b>Welcome to EKA Balance!</b> 🌿\n\nI am your personal wellness assistant. Link your account to receive notifications and manage bookings.`,
            {
                inline_keyboard: [
                    [{ text: "Open Dashboard", web_app: { url: "https://eka-balance.vercel.app" } }], // Replace with actual URL
                    [{ text: "My Bookings", callback_data: "cmd_bookings" }]
                ]
            }
        );
    }
    else if (text.startsWith('/dashboard')) {
        await sendTelegramMessage(chatId, "Access your wellness dashboard:", {
            inline_keyboard: [
                [{ text: "📅 Bookings", callback_data: "cmd_bookings" }, { text: "💰 Wallet", callback_data: "cmd_wallet" }],
                [{ text: "📓 Journal", callback_data: "cmd_journal" }]
            ]
        });
    }
    else if (text.startsWith('/today')) {
        // Therapist specific command check could go here
        await sendTelegramMessage(chatId, "Checking your schedule for today...");
        // Logic to fetch availability/bookings for this chat_id would happen here
        // For MVP, we can just say "No bookings found" or fetch from DB if linked.
    }
    else if (text.startsWith('/chatid')) {
        // Utility to get current chat ID
        await sendTelegramMessage(chatId, `Current Chat ID: <code>${chatId}</code>`);
    }

    // 5. Handle Callback Queries (Button clicks)
    if (body.callback_query) {
        const callbackChatId = body.callback_query.message.chat.id;
        const data = body.callback_query.data;

        if (data === 'cmd_bookings') {
            await sendTelegramMessage(callbackChatId, "You have 0 upcoming bookings.");
        } else if (data === 'cmd_wallet') {
            await sendTelegramMessage(callbackChatId, "Your balance: 5 Credits");
        }
        // Answer callback to stop loading spinner
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: body.callback_query.id })
        });
    }

    return NextResponse.json({ ok: true });
}
