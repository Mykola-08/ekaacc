import { createClient } from '@/lib/supabase/server';
import { getConfig } from '@/lib/config';

export class TelegramBotService {
  private async getBotToken() {
    return (await getConfig('TELEGRAM_BOT_TOKEN')) || process.env.TELEGRAM_BOT_TOKEN;
  }

  private async sendMessage(chatId: string | number, text: string, replyMarkup?: any) {
    const token = await this.getBotToken();
    if (!token) return;

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
        }),
      });
      if (!res.ok) console.error('Telegram Send Error', await res.text());
    } catch (e) {
      console.error('Telegram Network Error', e);
    }
  }

  async handleUpdate(body: any) {
    const token = await this.getBotToken();
    if (!token) return;

    const message = body.message || body.edited_message;

    // Handle Callbacks (Button clicks)
    if (body.callback_query) {
      await this.handleCallback(body.callback_query);
      return;
    }

    if (!message) return;

    const chatId = message.chat.id;
    const text = message.text || '';
    const username = message.from.username;

    // Command Routing
    if (text.startsWith('/start')) {
      await this.handleStart(chatId, username);
    } else if (text.startsWith('/journal')) {
      await this.handleJournal(chatId, text);
    } else {
      await this.handleDefault(chatId);
    }
  }

  private async handleStart(chatId: number, username: string) {
    const supabase = await createClient();
    await supabase.from('telegram_links').upsert(
      {
        telegram_chat_id: chatId,
        telegram_username: username,
      },
      { onConflict: 'telegram_chat_id' }
    );

    await this.sendMessage(
      chatId,
      `<b>Welcome to EKA Balance!</b> 🌿\n\nI can help you manage your sessions and well-being.`,
      {
        inline_keyboard: [
          [{ text: '📓 Quick Journal', callback_data: 'journal_start' }],
          [{ text: '📅 My Bookings', callback_data: 'bookings_list' }],
          [{ text: '🧠 AI Support', callback_data: 'ai_chat' }],
        ],
      }
    );
  }

  private async handleJournal(chatId: number, text: string) {
    // Simple one-shot journaling
    const note = text.replace('/journal', '').trim();
    if (!note) {
      await this.sendMessage(
        chatId,
        'Please type your note after /journal. Example: <i>/journal I felt great today!</i>'
      );
      return;
    }

    const supabase = await createClient();
    // Identify user via telegram_links
    const { data: link } = await supabase
      .from('telegram_links')
      .select('user_id')
      .eq('telegram_chat_id', chatId)
      .single();

    if (link?.user_id) {
      await supabase.from('journal_entries').insert({
        user_id: link.user_id,
        content: note,
        mood: 'neutral', // default, could use AI to infer
        source: 'telegram',
      });
      await this.sendMessage(chatId, '✅ Journal entry saved!');
    } else {
      await this.sendMessage(chatId, '⚠️ Please link your account first via the Web App.');
    }
  }

  private async handleCallback(callback: any) {
    const chatId = callback.message.chat.id;
    const data = callback.data;

    if (data === 'journal_start') {
      await this.sendMessage(
        chatId,
        'Type <code>/journal [your note]</code> to save a quick entry.'
      );
    } else if (data === 'bookings_list') {
      await this.sendMessage(chatId, 'Checking your bookings... (Feature coming soon)');
    }
  }

  private async handleDefault(chatId: number) {
    await this.sendMessage(chatId, "I didn't understand that command. Try /start for menu.");
  }
}

export const telegramBot = new TelegramBotService();
