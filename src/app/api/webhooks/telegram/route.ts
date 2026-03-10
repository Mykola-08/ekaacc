import { createClient } from '@/lib/supabase/admin';
import { getTelegramSecretToken } from '@/lib/config';
import { NextResponse } from 'next/server';
import * as telegramService from '@/server/telegram/service';
import * as telegramAnalytics from '@/server/telegram/analytics';
import { sendMessage, answerCallbackQuery, editMessageText } from '@/server/telegram/bot-api';
import type { TelegramUpdate, TelegramInlineKeyboardButton } from '@/server/telegram/types';
import { db } from '@/lib/db';
import { listServices, getBookingById } from '@/server/booking/service';
import { cancelBooking, getBookingsHistory, getWallet } from '@/server/dashboard/service';
import { getResources } from '@/server/resources/service';
import { personalizationService } from '@/server/ai/personalization-service';

export async function POST(req: Request) {
  // 1. Verify Secret Token
  const secretToken = await getTelegramSecretToken();
  const headerToken = req.headers.get('x-telegram-bot-api-secret-token');
  if (secretToken && headerToken !== secretToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const update: TelegramUpdate = await req.json();

  // Log raw event (fire-and-forget)
  const eventType = update.message
    ? 'message'
    : update.channel_post
      ? 'channel_post'
      : update.callback_query
        ? 'callback_query'
        : update.my_chat_member
          ? 'my_chat_member'
          : update.chat_member
            ? 'chat_member'
            : update.edited_channel_post
              ? 'edited_channel_post'
              : 'unknown';

  telegramService.logWebhookEvent(update.update_id, eventType, update).catch(() => {});

  try {
    // ── Handle Private / Group Messages ───────────────────────
    if (update.message) {
      await handleMessage(update);
    }

    // ── Handle Channel Posts (auto-track analytics) ───────────
    if (update.channel_post) {
      await handleChannelPost(update);
    }

    // ── Handle Edited Channel Posts ───────────────────────────
    if (update.edited_channel_post) {
      await handleEditedChannelPost(update);
    }

    // ── Handle Callback Queries (inline buttons) ─────────────
    if (update.callback_query) {
      await handleCallbackQuery(update);
    }

    // ── Handle Bot Added/Removed from Chat ───────────────────
    if (update.my_chat_member) {
      await handleMyChatMember(update);
    }

    // ── Handle Member Join/Leave ─────────────────────────────
    if (update.chat_member) {
      await handleChatMember(update);
    }
  } catch (error) {
    console.error('[Telegram Webhook] Processing error:', error);
  }

  return NextResponse.json({ ok: true });
}

// ─── Message Handler ──────────────────────────────────────────

async function handleMessage(update: TelegramUpdate) {
  const msg = update.message!;
  const { chat, text, from, new_chat_members, left_chat_member } = msg;
  const supabase = createClient();

  // Track new members joining a group
  if (new_chat_members && new_chat_members.length > 0) {
    const { data: channel } = await supabase
      .from('telegram_channels')
      .select('id')
      .eq('chat_id', chat.id)
      .single();

    if (channel) {
      for (const member of new_chat_members) {
        if (!member.is_bot) {
          await telegramService.trackMember(channel.id, member.id, {
            username: member.username,
            firstName: member.first_name,
            lastName: member.last_name,
            status: 'member',
          });
        }
      }
    }
    return;
  }

  // Track members leaving
  if (left_chat_member) {
    const { data: channel } = await supabase
      .from('telegram_channels')
      .select('id')
      .eq('chat_id', chat.id)
      .single();

    if (channel && !left_chat_member.is_bot) {
      await telegramService.trackMember(channel.id, left_chat_member.id, {
        status: 'left',
      });
    }
    return;
  }

  // Bot commands
  if (text?.startsWith('/')) {
    const [cmd, ...argParts] = text.split(' ');
    const args = argParts.join(' ');
    const command = cmd.split('@')[0]; // Strip @botname

    switch (command) {
      case '/start':
        await handleStartCommand(chat.id, from);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/start', args);
        break;

      case '/link':
        await handleLinkCommand(chat.id, from, args);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/link', args);
        break;

      case '/help':
        await handleHelpCommand(chat.id);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/help', null);
        break;

      case '/status':
        await handleStatusCommand(chat.id, from);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/status', null);
        break;

      case '/unlink':
        await handleUnlinkCommand(chat.id, from);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/unlink', null);
        break;

      case '/info':
        await handleInfoCommand(chat.id);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/info', null);
        break;

      case '/stats':
        await handleStatsCommand(chat.id);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/stats', null);
        break;

      case '/book':
        await handleBookCommand(chat.id, from, args);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/book', args);
        break;

      case '/appointments':
        await handleAppointmentsCommand(chat.id, from);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/appointments', null);
        break;

      case '/cancel':
        await handleCancelCommand(chat.id, from, args);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/cancel', args);
        break;

      case '/notifications':
        await handleNotificationsCommand(chat.id, from);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/notifications', null);
        break;

      case '/history':
        await handleHistoryCommand(chat.id, from);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/history', null);
        break;

      case '/wallet':
        await handleWalletCommand(chat.id, from);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/wallet', null);
        break;

      case '/mood':
        await handleMoodCommand(chat.id, from, args);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/mood', args);
        break;

      case '/resources':
        await handleResourcesCommand(chat.id, args);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/resources', args);
        break;

      case '/reschedule':
        await handleRescheduleCommand(chat.id, from, args);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/reschedule', args);
        break;

      case '/details':
        await handleDetailsCommand(chat.id, from, args);
        await telegramService.logBotCommand(from?.id ?? null, chat.id, '/details', args);
        break;

      default:
        await telegramService.logBotCommand(from?.id ?? null, chat.id, command, args, 'ignored');
        break;
    }
  }
}

// ─── Channel Post Handler ─────────────────────────────────────

async function handleChannelPost(update: TelegramUpdate) {
  const post = update.channel_post!;
  const supabase = createClient();

  // Find or register the channel
  let channel;
  const { data: existing } = await supabase
    .from('telegram_channels')
    .select('id')
    .eq('chat_id', post.chat.id)
    .single();

  if (!existing) {
    channel = await telegramService.registerChannel(post.chat.id);
  } else {
    channel = existing;
  }

  if (!channel) return;

  // Check if this was a post published from our system
  const { data: trackedPost } = await supabase
    .from('telegram_posts')
    .select('id')
    .eq('channel_id', channel.id)
    .eq('message_id', post.message_id)
    .single();

  // If views data is available, record analytics
  if (trackedPost && post.views) {
    await telegramAnalytics.recordPostAnalytics(trackedPost.id, {
      views: post.views,
    });
  }
}

// ─── Edited Channel Post Handler ──────────────────────────────

async function handleEditedChannelPost(update: TelegramUpdate) {
  const post = update.edited_channel_post!;
  const supabase = createClient();

  const { data: channel } = await supabase
    .from('telegram_channels')
    .select('id')
    .eq('chat_id', post.chat.id)
    .single();

  if (!channel) return;

  // Update views if available
  const { data: trackedPost } = await supabase
    .from('telegram_posts')
    .select('id')
    .eq('channel_id', channel.id)
    .eq('message_id', post.message_id)
    .single();

  if (trackedPost && post.views) {
    await telegramAnalytics.recordPostAnalytics(trackedPost.id, {
      views: post.views,
    });
  }
}

// ─── Callback Query Handler ───────────────────────────────────

async function handleCallbackQuery(update: TelegramUpdate) {
  const query = update.callback_query!;
  const data = query.data;
  const chatId = query.message?.chat.id;
  const messageId = query.message?.message_id;

  if (!data) {
    await answerCallbackQuery(query.id);
    return;
  }

  try {
    // ── Service detail view ─────────────────────────────────
    if (data.startsWith('svc_detail:')) {
      const slug = data.replace('svc_detail:', '');
      await answerCallbackQuery(query.id);

      const result = await listServices();
      const services = (result?.data ?? []) as Array<{
        name: string; slug: string; description: string | null;
        minPrice: number; duration: number; currency: string; category: string | null;
      }>;
      const service = services.find((s) => s.slug === slug);
      if (!service || !chatId) return;

      const buttons: TelegramInlineKeyboardButton[][] = [
        [{ text: '📅 Book This Service', web_app: { url: `${siteUrl()}/booking/${service.slug}` } }],
        [{ text: '🔙 All Services', callback_data: 'services_list' }],
      ];

      if (messageId) {
        await editMessageText(chatId, messageId, [
          `💆 <b>${service.name}</b>`,
          '',
          service.description ?? '',
          '',
          `⏱ ${service.duration} min`,
          `💰 From ${service.minPrice} ${service.currency}`,
          service.category ? `📂 ${service.category}` : '',
        ].filter(Boolean).join('\n'), { replyMarkup: { inline_keyboard: buttons } });
      }
      return;
    }

    // ── Services list (back button / paginated) ─────────────
    if (data === 'services_list') {
      await answerCallbackQuery(query.id);
      if (chatId) await handleBookCommand(chatId, query.from, '');
      return;
    }

    // ── Services pagination ─────────────────────────────────
    if (data.startsWith('services_page:')) {
      const offset = parseInt(data.replace('services_page:', ''), 10);
      await answerCallbackQuery(query.id);

      const result = await listServices();
      const services = (result?.data ?? []) as Array<{
        name: string; slug: string; description: string | null;
        minPrice: number; duration: number; currency: string; category: string | null;
      }>;
      const PAGE_SIZE = 5;
      const page = services.slice(offset, offset + PAGE_SIZE);

      if (page.length === 0 || !chatId || !messageId) return;

      const serviceButtons: TelegramInlineKeyboardButton[][] = page.map((s) => ([
        {
          text: `${s.name} — ${s.duration}min · ${s.minPrice} ${s.currency}`,
          callback_data: `svc_detail:${s.slug}`,
        },
      ]));

      const navRow: TelegramInlineKeyboardButton[] = [];
      if (offset > 0) {
        navRow.push({ text: '◀️ Previous', callback_data: `services_page:${Math.max(0, offset - PAGE_SIZE)}` });
      }
      if (offset + PAGE_SIZE < services.length) {
        navRow.push({ text: '▶️ Next', callback_data: `services_page:${offset + PAGE_SIZE}` });
      }
      if (navRow.length > 0) serviceButtons.push(navRow);
      serviceButtons.push([{ text: '🌐 Open Booking Page', web_app: { url: `${siteUrl()}/booking` } }]);

      await editMessageText(chatId, messageId, [
        `📋 <b>Services (${offset + 1}–${Math.min(offset + PAGE_SIZE, services.length)} of ${services.length})</b>`,
        '',
        'Tap a service to see details:',
      ].join('\n'), { replyMarkup: { inline_keyboard: serviceButtons } });
      return;
    }

    // ── Book via URL (legacy) ───────────────────────────────
    if (data.startsWith('book:')) {
      const serviceSlug = data.replace('book:', '');
      await answerCallbackQuery(query.id, {
        text: `Opening booking for ${serviceSlug}...`,
      });
      // Send a message with the WebApp button as fallback
      if (chatId) {
        await sendMessage(chatId, `📅 Tap below to book <b>${serviceSlug}</b>:`, {
          replyMarkup: {
            inline_keyboard: [[
              { text: '📅 Open Booking', web_app: { url: `${siteUrl()}/booking/${serviceSlug}` } },
            ]],
          },
        });
      }
      return;
    }

    // ── Cancel confirmation ask ─────────────────────────────
    if (data.startsWith('cancel_ask:')) {
      const bookingId = data.replace('cancel_ask:', '');
      await answerCallbackQuery(query.id);
      if (chatId) {
        const userId = await resolveLinkedUser(chatId);
        if (!userId) return;

        const { rows } = await db.query(
          `SELECT b.id, b.starts_at, s.name as service_name
           FROM bookings b JOIN service s ON b.service_id = s.id
           WHERE b.id = $1 AND b.client_id = $2 AND b.status IN ('scheduled', 'confirmed')`,
          [bookingId, userId]
        );
        if (rows.length === 0) {
          await sendMessage(chatId, '❌ Booking not found or already cancelled.');
          return;
        }
        const booking = rows[0]!;
        const date = new Date(booking.starts_at);
        const dateStr = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
        const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        const text = [
          '⚠️ <b>Confirm Cancellation</b>',
          '',
          `Service: <b>${booking.service_name}</b>`,
          `Date: ${dateStr} at ${timeStr}`,
          '',
          'Are you sure?',
        ].join('\n');

        if (messageId) {
          await editMessageText(chatId, messageId, text, {
            replyMarkup: {
              inline_keyboard: [[
                { text: '✅ Yes, Cancel', callback_data: `cancel_confirm:${bookingId}` },
                { text: '🔙 No, Keep', callback_data: 'cancel_abort' },
              ]],
            },
          });
        } else {
          await sendMessage(chatId, text, {
            replyMarkup: {
              inline_keyboard: [[
                { text: '✅ Yes, Cancel', callback_data: `cancel_confirm:${bookingId}` },
                { text: '🔙 No, Keep', callback_data: 'cancel_abort' },
              ]],
            },
          });
        }
      }
      return;
    }

    // ── Cancel confirmed ────────────────────────────────────
    if (data.startsWith('cancel_confirm:')) {
      const bookingId = data.replace('cancel_confirm:', '');
      if (!chatId) {
        await answerCallbackQuery(query.id, { text: 'Error: missing chat' });
        return;
      }

      const userId = await resolveLinkedUser(chatId);
      if (!userId) {
        await answerCallbackQuery(query.id, { text: 'Account not linked', showAlert: true });
        return;
      }

      const result = await cancelBooking(bookingId, userId);
      if (result.success) {
        await answerCallbackQuery(query.id, { text: '✅ Booking cancelled!' });
        if (messageId) {
          await editMessageText(chatId, messageId, '✅ <b>Booking cancelled successfully.</b>\n\nUse /appointments to see your remaining bookings.', {
            replyMarkup: {
              inline_keyboard: [[
                { text: '📋 My Appointments', callback_data: 'my_appointments' },
                { text: '📅 Book New', callback_data: 'services_list' },
              ]],
            },
          });
        }
      } else {
        await answerCallbackQuery(query.id, { text: '❌ Failed to cancel', showAlert: true });
      }
      return;
    }

    // ── Cancel aborted ──────────────────────────────────────
    if (data === 'cancel_abort') {
      await answerCallbackQuery(query.id, { text: 'Cancellation aborted' });
      if (chatId && messageId) {
        await editMessageText(chatId, messageId, '👍 <b>Booking kept.</b> Your appointment is still scheduled.', {
          replyMarkup: {
            inline_keyboard: [[
              { text: '📋 My Appointments', callback_data: 'my_appointments' },
            ]],
          },
        });
      }
      return;
    }

    // ── View appointments (from callback) ───────────────────
    if (data === 'my_appointments') {
      await answerCallbackQuery(query.id);
      if (chatId) await handleAppointmentsCommand(chatId, query.from);
      return;
    }

    // ── Notification toggle ─────────────────────────────────
    if (data.startsWith('notif_toggle:')) {
      const category = data.replace('notif_toggle:', '');
      if (!chatId) {
        await answerCallbackQuery(query.id, { text: 'Error' });
        return;
      }

      const userId = await resolveLinkedUser(chatId);
      if (!userId) {
        await answerCallbackQuery(query.id, { text: 'Account not linked', showAlert: true });
        return;
      }

      const columnKey = `${category}_telegram`;
      const supabase = createClient();

      // Get current value and toggle
      const { data: settings } = await supabase
        .from('user_notification_settings')
        .select(columnKey)
        .eq('user_id', userId)
        .single();

      const currentVal = settings?.[columnKey] ?? true;
      const newVal = !currentVal;

      await supabase
        .from('user_notification_settings')
        .update({ [columnKey]: newVal })
        .eq('user_id', userId);

      await answerCallbackQuery(query.id, {
        text: `${newVal ? '✅ Enabled' : '❌ Disabled'}: ${category} notifications`,
      });

      // Refresh the full notification settings message
      if (chatId) await handleNotificationsCommand(chatId, query.from);
      return;
    }

    // ── Booking detail view ─────────────────────────────────
    if (data.startsWith('booking_detail:')) {
      const bookingId = data.replace('booking_detail:', '');
      await answerCallbackQuery(query.id);
      if (chatId) await handleDetailsCommand(chatId, query.from, bookingId);
      return;
    }

    // ── Rebook (open booking page for the same service) ─────
    if (data.startsWith('rebook:')) {
      const serviceId = data.replace('rebook:', '');
      await answerCallbackQuery(query.id);

      if (!chatId) return;

      // Look up the service slug
      const { rows } = await db.query(
        `SELECT slug, name FROM service WHERE id = $1 AND active = true`,
        [serviceId]
      );

      if (rows.length === 0) {
        await sendMessage(chatId, '❌ This service is no longer available.');
        return;
      }

      const service = rows[0]!;
      await sendMessage(chatId, [
        `🔄 <b>Rebook: ${service.name}</b>`,
        '',
        'Tap below to book a new appointment:',
      ].join('\n'), {
        replyMarkup: {
          inline_keyboard: [
            [{ text: '📅 Book Now', web_app: { url: `${siteUrl()}/booking/${service.slug}` } }],
            [{ text: '🔙 Back to History', callback_data: 'my_history' }],
          ],
        },
      });
      return;
    }

    // ── Reschedule redirect ─────────────────────────────────
    if (data.startsWith('reschedule:')) {
      const bookingId = data.replace('reschedule:', '');
      await answerCallbackQuery(query.id);
      if (chatId) await handleRescheduleCommand(chatId, query.from, bookingId);
      return;
    }

    // ── View history (from callback) ────────────────────────
    if (data === 'my_history') {
      await answerCallbackQuery(query.id);
      if (chatId) await handleHistoryCommand(chatId, query.from);
      return;
    }

    // ── View wallet (from callback) ─────────────────────────
    if (data === 'my_wallet') {
      await answerCallbackQuery(query.id);
      if (chatId) await handleWalletCommand(chatId, query.from);
      return;
    }

    // ── Mood logging via button ─────────────────────────────
    if (data.startsWith('mood:')) {
      const score = data.replace('mood:', '');
      await answerCallbackQuery(query.id);
      if (chatId) await handleMoodCommand(chatId, query.from, score);
      return;
    }

    // ── Resources category filter ───────────────────────────
    if (data.startsWith('resources:')) {
      const category = data.replace('resources:', '');
      await answerCallbackQuery(query.id);
      if (chatId) await handleResourcesCommand(chatId, category === 'all' ? '' : category);
      return;
    }

    // ── Fallback ────────────────────────────────────────────
    await answerCallbackQuery(query.id, { text: 'Action processed!' });
  } catch (error) {
    console.error('[Telegram] handleCallbackQuery error:', error);
    await answerCallbackQuery(query.id, { text: '⚠️ Something went wrong', showAlert: true });
  }
}

// ─── Bot Membership Change Handler ────────────────────────────

async function handleMyChatMember(update: TelegramUpdate) {
  const memberUpdate = update.my_chat_member!;
  const newStatus = memberUpdate.new_chat_member.status;
  const chat = memberUpdate.chat;

  if (['administrator', 'member'].includes(newStatus)) {
    // Bot was added to a chat — register it
    await telegramService.registerChannel(chat.id);
  } else if (['left', 'kicked'].includes(newStatus)) {
    // Bot was removed — deactivate channel
    const supabase = createClient();
    const { data: channel } = await supabase
      .from('telegram_channels')
      .select('id')
      .eq('chat_id', chat.id)
      .single();

    if (channel) {
      await telegramService.deactivateChannel(channel.id);
    }
  }
}

// ─── Chat Member Change Handler ───────────────────────────────

async function handleChatMember(update: TelegramUpdate) {
  const memberUpdate = update.chat_member!;
  const supabase = createClient();

  const { data: channel } = await supabase
    .from('telegram_channels')
    .select('id')
    .eq('chat_id', memberUpdate.chat.id)
    .single();

  if (!channel) return;

  const user = memberUpdate.new_chat_member.user;
  if (user.is_bot) return;

  await telegramService.trackMember(channel.id, user.id, {
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    status: memberUpdate.new_chat_member.status,
  });
}

// ─── Bot Command Implementations ──────────────────────────────

async function handleStartCommand(chatId: number, from?: TelegramUpdate['message'] extends { from?: infer F } ? F : never) {
  const name = from?.first_name ?? 'there';
  await sendMessage(chatId, [
    `👋 <b>Welcome, ${name}!</b>`,
    '',
    'I\'m the EKA Balance wellness bot. Here\'s what I can do:',
    '',
    '🔗 <b>/link [code]</b> — Link your Telegram to your EKA account',
    '� <b>/book</b> — Browse & book appointments',
    '📋 <b>/appointments</b> — View upcoming appointments',
    '❌ <b>/cancel [id]</b> — Cancel an appointment',
    '🔔 <b>/notifications</b> — Your notification settings',
    '📊 <b>/status</b> — Check your account status',
    '🔓 <b>/unlink</b> — Unlink your Telegram account',
    '❓ <b>/help</b> — Show this help message',
    '',
    '🌿 Start your wellness journey at <b>ekabalance.com</b>',
  ].join('\n'), {
    replyMarkup: {
      inline_keyboard: [[
        { text: '🌐 Visit EKA Balance', url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ekabalance.com' },
        { text: '📅 Book Now', url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ekabalance.com'}/booking` },
      ]],
    },
  });
}

async function handleLinkCommand(chatId: number, from: any, code: string) {
  if (!code?.trim()) {
    await sendMessage(chatId, '⚠️ Please provide your link code: <code>/link YOUR_CODE</code>');
    return;
  }

  const supabase = createClient();
  const { data: link } = await supabase
    .from('telegram_links')
    .select('id, user_id')
    .eq('verification_code', code.trim())
    .eq('is_verified', false)
    .single();

  if (link) {
    await supabase
      .from('telegram_links')
      .update({
        telegram_chat_id: chatId,
        telegram_username: from?.username ?? null,
        is_verified: true,
        verification_code: null,
      })
      .eq('id', link.id);

    await sendMessage(chatId, '✅ <b>Account linked successfully!</b>\n\nYou\'ll now receive notifications, booking reminders, and wellness tips here.');
  } else {
    await sendMessage(chatId, '❌ Invalid or expired link code. Please generate a new one from your EKA dashboard.');
  }
}

async function handleHelpCommand(chatId: number) {
  await sendMessage(chatId, [
    '📖 <b>EKA Balance Bot — Full Command List</b>',
    '',
    '<b>📅 Bookings & Scheduling</b>',
    '/book — Browse available services',
    '/book [slug] — View a specific service',
    '/appointments — View upcoming appointments',
    '/history — Past booking results',
    '/details [id] — Full booking details',
    '/cancel [id] — Cancel a booking',
    '/reschedule [id] — Reschedule a booking',
    '',
    '<b>🌿 Wellness & Tracking</b>',
    '/mood [1-10] [notes] — Log your mood',
    '/resources — Browse wellness content',
    '/resources [category] — Filter (article/video/exercise/meditation)',
    '',
    '<b>💰 Wallet & Rewards</b>',
    '/wallet — Check balance & points',
    '',
    '<b>⚙️ Account & Settings</b>',
    '/link [code] — Link Telegram to EKA',
    '/status — Account & link status',
    '/notifications — Notification preferences',
    '/unlink — Disconnect account',
    '',
    '<b>📊 Admin (Groups/Channels)</b>',
    '/info — Group/channel info',
    '/stats — Quick analytics',
    '',
    '💡 Tap inline buttons for quick actions!',
  ].join('\n'), {
    replyMarkup: {
      inline_keyboard: [
        [
          { text: '📅 Book Now', callback_data: 'services_list' },
          { text: '📋 My Appointments', callback_data: 'my_appointments' },
        ],
        [
          { text: '📚 My History', callback_data: 'my_history' },
          { text: '💰 My Wallet', callback_data: 'my_wallet' },
        ],
      ],
    },
  });
}

async function handleStatusCommand(chatId: number, from: any) {
  if (!from?.id) {
    await sendMessage(chatId, '❌ Could not identify your Telegram account.');
    return;
  }

  const supabase = createClient();
  const { data: link } = await supabase
    .from('telegram_links')
    .select('user_id, is_verified, created_at')
    .eq('telegram_chat_id', chatId)
    .eq('is_verified', true)
    .single();

  if (link) {
    const linkedDate = new Date(link.created_at).toLocaleDateString();
    await sendMessage(chatId, [
      '✅ <b>Account Linked</b>',
      '',
      `📅 Linked since: ${linkedDate}`,
      '🔔 Notifications: Active',
      '',
      'You\'re all set to receive updates!',
    ].join('\n'));
  } else {
    await sendMessage(chatId, [
      '⚠️ <b>Not Linked</b>',
      '',
      'Your Telegram is not linked to an EKA account.',
      'Use /link [code] to connect.',
    ].join('\n'));
  }
}

async function handleUnlinkCommand(chatId: number, from: any) {
  if (!from?.id) {
    await sendMessage(chatId, '❌ Could not identify your Telegram account.');
    return;
  }

  const supabase = createClient();
  const { data: link } = await supabase
    .from('telegram_links')
    .select('id')
    .eq('telegram_chat_id', chatId)
    .eq('is_verified', true)
    .single();

  if (link) {
    await supabase
      .from('telegram_links')
      .delete()
      .eq('id', link.id);

    await sendMessage(chatId, '🔓 Account unlinked. You will no longer receive notifications here.');
  } else {
    await sendMessage(chatId, 'ℹ️ No linked account found for this chat.');
  }
}

async function handleInfoCommand(chatId: number) {
  const supabase = createClient();
  const { data: channel } = await supabase
    .from('telegram_channels')
    .select('*')
    .eq('chat_id', chatId)
    .single();

  if (channel) {
    await sendMessage(chatId, [
      `ℹ️ <b>${channel.title}</b>`,
      '',
      `Type: ${channel.type}`,
      `Members: ${channel.member_count}`,
      `Bot Admin: ${channel.bot_is_admin ? '✅' : '❌'}`,
      `Active: ${channel.is_active ? '✅' : '❌'}`,
      channel.username ? `@${channel.username}` : '',
    ].filter(Boolean).join('\n'));
  } else {
    await sendMessage(chatId, 'ℹ️ This chat is not registered with the bot.');
  }
}

async function handleStatsCommand(chatId: number) {
  const supabase = createClient();
  const { data: channel } = await supabase
    .from('telegram_channels')
    .select('id, title, member_count')
    .eq('chat_id', chatId)
    .single();

  if (!channel) {
    await sendMessage(chatId, 'ℹ️ No stats available for this chat.');
    return;
  }

  const overview = await telegramAnalytics.getChannelOverview(channel.id);

  await sendMessage(chatId, [
    `📈 <b>Stats: ${channel.title}</b>`,
    '',
    `👥 Members: <b>${overview.totalMembers}</b>`,
    `📝 Total Posts: <b>${overview.totalPosts}</b>`,
    `✅ Published: <b>${overview.publishedPosts}</b>`,
    `⏰ Scheduled: <b>${overview.scheduledPosts}</b>`,
    `📄 Drafts: <b>${overview.draftPosts}</b>`,
    '',
    `<b>Last 7 days:</b>`,
    `👀 Views: ${overview.last7DaysViews}`,
    `👤 New Members: +${overview.last7DaysNewMembers}`,
    `📊 Engagement: ${overview.avgEngagementRate}%`,
  ].join('\n'));
}

// ─── Helper: Resolve linked user from Telegram chat ───────────

async function resolveLinkedUser(chatId: number): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('telegram_links')
    .select('user_id')
    .eq('telegram_chat_id', chatId)
    .eq('is_verified', true)
    .single();
  return data?.user_id ?? null;
}

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ekabalance.com';

// ─── /book Command ────────────────────────────────────────────

async function handleBookCommand(chatId: number, from: any, args: string) {
  try {
    const result = await listServices();
    const services = (result?.data ?? []) as Array<{
      name: string;
      slug: string;
      description: string | null;
      minPrice: number;
      duration: number;
      currency: string;
      category: string | null;
    }>;

    if (services.length === 0) {
      await sendMessage(chatId, '😔 No services are currently available. Check back later!');
      return;
    }

    // If a specific service slug was provided, show its detail
    if (args?.trim()) {
      const slug = args.trim().toLowerCase();
      const service = services.find((s) => s.slug === slug);
      if (service) {
        const buttons: TelegramInlineKeyboardButton[][] = [
          [
            {
              text: '📅 Book Now',
              web_app: { url: `${siteUrl()}/booking/${service.slug}` },
            },
          ],
          [
            { text: '🔙 All Services', callback_data: 'services_list' },
          ],
        ];
        await sendMessage(chatId, [
          `💆 <b>${service.name}</b>`,
          '',
          service.description ?? '',
          '',
          `⏱ ${service.duration} min`,
          `💰 From ${service.minPrice} ${service.currency}`,
          service.category ? `📂 ${service.category}` : '',
        ].filter(Boolean).join('\n'), { replyMarkup: { inline_keyboard: buttons } });
        return;
      }
      await sendMessage(chatId, `❌ Service "<b>${args.trim()}</b>" not found. Use /book to see all services.`);
      return;
    }

    // Show paginated service list with inline buttons
    const PAGE_SIZE = 5;
    const page = services.slice(0, PAGE_SIZE);

    const serviceButtons: TelegramInlineKeyboardButton[][] = page.map((s) => ([
      {
        text: `${s.name} — ${s.duration}min · ${s.minPrice} ${s.currency}`,
        callback_data: `svc_detail:${s.slug}`,
      },
    ]));

    // WebApp button to open the full booking page
    serviceButtons.push([
      {
        text: '🌐 Open Full Booking Page',
        web_app: { url: `${siteUrl()}/booking` },
      },
    ]);

    if (services.length > PAGE_SIZE) {
      serviceButtons.push([
        { text: `▶️ More (${services.length - PAGE_SIZE} more)`, callback_data: `services_page:${PAGE_SIZE}` },
      ]);
    }

    await sendMessage(chatId, [
      '📋 <b>Available Services</b>',
      '',
      'Tap a service to see details, or open the full booking page:',
    ].join('\n'), { replyMarkup: { inline_keyboard: serviceButtons } });
  } catch (error) {
    console.error('[Telegram] handleBookCommand error:', error);
    await sendMessage(chatId, '⚠️ Unable to load services right now. Please try again later.');
  }
}

// ─── /appointments Command ────────────────────────────────────

async function handleAppointmentsCommand(chatId: number, from: any) {
  const userId = await resolveLinkedUser(chatId);
  if (!userId) {
    await sendMessage(chatId, [
      '🔗 <b>Account not linked</b>',
      '',
      'Link your Telegram to your EKA account first:',
      '1. Go to your Dashboard → Settings → Telegram',
      '2. Copy the link code',
      '3. Send <code>/link YOUR_CODE</code> here',
    ].join('\n'), {
      replyMarkup: {
        inline_keyboard: [[
          { text: '⚙️ Open Settings', web_app: { url: `${siteUrl()}/dashboard/settings` } },
        ]],
      },
    });
    return;
  }

  try {
    // Fetch multiple upcoming bookings (the dashboard service only returns 1)
    const { rows } = await db.query(
      `SELECT b.id, b.starts_at, b.ends_at, b.status, s.name as service_name, s.slug as service_slug
       FROM bookings b
       JOIN service s ON b.service_id = s.id
       WHERE b.client_id = $1
         AND b.starts_at > NOW()
         AND b.status IN ('scheduled', 'confirmed')
       ORDER BY b.starts_at ASC
       LIMIT 10`,
      [userId]
    );

    if (rows.length === 0) {
      await sendMessage(chatId, [
        '📋 <b>No upcoming appointments</b>',
        '',
        'You don\'t have any upcoming bookings. Would you like to book one?',
      ].join('\n'), {
        replyMarkup: {
          inline_keyboard: [
            [{ text: '📅 Browse Services', callback_data: 'services_list' }],
            [{ text: '🌐 Open Booking Page', web_app: { url: `${siteUrl()}/booking` } }],
          ],
        },
      });
      return;
    }

    const lines = ['📋 <b>Your Upcoming Appointments</b>', ''];
    const buttons: TelegramInlineKeyboardButton[][] = [];

    for (const row of rows) {
      const date = new Date(row.starts_at);
      const dateStr = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      lines.push(`• <b>${row.service_name}</b>`);
      lines.push(`  📅 ${dateStr} at ${timeStr} — <i>${row.status}</i>`);
      lines.push('');

      buttons.push([
        { text: `❌ Cancel: ${row.service_name}`, callback_data: `cancel_ask:${row.id}` },
      ]);
    }

    buttons.push([
      { text: '🌐 Open Dashboard', web_app: { url: `${siteUrl()}/dashboard` } },
    ]);

    await sendMessage(chatId, lines.join('\n'), {
      replyMarkup: { inline_keyboard: buttons },
    });
  } catch (error) {
    console.error('[Telegram] handleAppointmentsCommand error:', error);
    await sendMessage(chatId, '⚠️ Unable to load appointments right now. Please try again later.');
  }
}

// ─── /cancel Command ──────────────────────────────────────────

async function handleCancelCommand(chatId: number, from: any, args: string) {
  const userId = await resolveLinkedUser(chatId);
  if (!userId) {
    await sendMessage(chatId, '🔗 Please link your account first with /link [code]');
    return;
  }

  const bookingId = args?.trim();
  if (!bookingId) {
    // Show upcoming appointments so user can pick one to cancel
    await sendMessage(chatId, [
      '❌ <b>Cancel a Booking</b>',
      '',
      'Use <code>/cancel BOOKING_ID</code> or tap an appointment below:',
    ].join('\n'));
    // Reuse appointments view to let them pick
    await handleAppointmentsCommand(chatId, from);
    return;
  }

  // Ask for confirmation with inline buttons
  try {
    const { rows } = await db.query(
      `SELECT b.id, b.starts_at, s.name as service_name
       FROM bookings b
       JOIN service s ON b.service_id = s.id
       WHERE b.id = $1 AND b.client_id = $2 AND b.status IN ('scheduled', 'confirmed')`,
      [bookingId, userId]
    );

    if (rows.length === 0) {
      await sendMessage(chatId, '❌ Booking not found or already cancelled.');
      return;
    }

    const booking = rows[0]!;
    const date = new Date(booking.starts_at);
    const dateStr = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    await sendMessage(chatId, [
      '⚠️ <b>Confirm Cancellation</b>',
      '',
      `Service: <b>${booking.service_name}</b>`,
      `Date: ${dateStr} at ${timeStr}`,
      '',
      'Are you sure you want to cancel this appointment?',
    ].join('\n'), {
      replyMarkup: {
        inline_keyboard: [
          [
            { text: '✅ Yes, Cancel', callback_data: `cancel_confirm:${bookingId}` },
            { text: '🔙 No, Keep It', callback_data: `cancel_abort:${bookingId}` },
          ],
        ],
      },
    });
  } catch (error) {
    console.error('[Telegram] handleCancelCommand error:', error);
    await sendMessage(chatId, '⚠️ Something went wrong. Please try again.');
  }
}

// ─── /notifications Command ───────────────────────────────────

const NOTIFICATION_CATEGORIES = [
  { key: 'booking', label: '📅 Bookings', desc: 'Booking confirmations & updates' },
  { key: 'reminder', label: '⏰ Reminders', desc: 'Appointment reminders' },
  { key: 'marketing', label: '📢 Marketing', desc: 'Promotions & offers' },
  { key: 'updates', label: '📰 Updates', desc: 'Platform news & changes' },
  { key: 'security', label: '🔒 Security', desc: 'Security alerts' },
] as const;

async function handleNotificationsCommand(chatId: number, from: any) {
  const userId = await resolveLinkedUser(chatId);
  if (!userId) {
    await sendMessage(chatId, '🔗 Please link your account first with /link [code]');
    return;
  }

  try {
    const supabase = createClient();
    const { data: settings } = await supabase
      .from('user_notification_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    const lines = ['🔔 <b>Telegram Notification Settings</b>', '', 'Tap a category to toggle it on/off:', ''];
    const buttons: TelegramInlineKeyboardButton[][] = [];

    for (const cat of NOTIFICATION_CATEGORIES) {
      const columnKey = `${cat.key}_telegram`;
      const isEnabled = settings?.[columnKey] ?? true;
      const icon = isEnabled ? '✅' : '❌';
      lines.push(`${icon} ${cat.label}: ${cat.desc}`);
      buttons.push([
        {
          text: `${icon} ${cat.label} — Tap to ${isEnabled ? 'disable' : 'enable'}`,
          callback_data: `notif_toggle:${cat.key}`,
        },
      ]);
    }

    buttons.push([
      { text: '⚙️ All Settings', web_app: { url: `${siteUrl()}/dashboard/settings` } },
    ]);

    await sendMessage(chatId, lines.join('\n'), {
      replyMarkup: { inline_keyboard: buttons },
    });
  } catch (error) {
    console.error('[Telegram] handleNotificationsCommand error:', error);
    await sendMessage(chatId, '⚠️ Unable to load notification settings. Please try again.');
  }
}

// ─── /history Command ─────────────────────────────────────────

async function handleHistoryCommand(chatId: number, from: any) {
  const userId = await resolveLinkedUser(chatId);
  if (!userId) {
    await sendMessage(chatId, '🔗 Please link your account first with /link [code]');
    return;
  }

  try {
    const bookings = await getBookingsHistory(userId);

    if (!bookings || bookings.length === 0) {
      await sendMessage(chatId, [
        '📚 <b>Booking History</b>',
        '',
        'You don\'t have any past bookings yet.',
      ].join('\n'), {
        replyMarkup: {
          inline_keyboard: [
            [{ text: '📅 Book Your First Session', callback_data: 'services_list' }],
          ],
        },
      });
      return;
    }

    // Show most recent 10
    const recent = bookings.slice(0, 10);
    const lines = ['📚 <b>Booking History</b>', ''];
    const buttons: TelegramInlineKeyboardButton[][] = [];

    const statusIcons: Record<string, string> = {
      completed: '✅',
      cancelled: '❌',
      scheduled: '📅',
      confirmed: '✅',
      no_show: '⚠️',
    };

    for (const b of recent) {
      const date = new Date(b.startTime);
      const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const icon = statusIcons[b.status] ?? '•';

      lines.push(`${icon} <b>${b.serviceName}</b>`);
      lines.push(`   ${dateStr} — <i>${b.status}</i>`);
      lines.push('');

      // Rebook button for completed/cancelled
      if (b.status === 'completed' || b.status === 'cancelled') {
        buttons.push([
          { text: `🔄 Rebook: ${b.serviceName}`, callback_data: `rebook:${b.serviceId}` },
          { text: '📄 Details', callback_data: `booking_detail:${b.id}` },
        ]);
      } else {
        buttons.push([
          { text: `📄 Details: ${b.serviceName}`, callback_data: `booking_detail:${b.id}` },
        ]);
      }
    }

    if (bookings.length > 10) {
      lines.push(`<i>Showing 10 of ${bookings.length} bookings</i>`);
    }

    buttons.push([
      { text: '🌐 Full History', web_app: { url: `${siteUrl()}/dashboard` } },
    ]);

    await sendMessage(chatId, lines.join('\n'), {
      replyMarkup: { inline_keyboard: buttons },
    });
  } catch (error) {
    console.error('[Telegram] handleHistoryCommand error:', error);
    await sendMessage(chatId, '⚠️ Unable to load booking history. Please try again.');
  }
}

// ─── /details Command ─────────────────────────────────────────

async function handleDetailsCommand(chatId: number, from: any, args: string) {
  const userId = await resolveLinkedUser(chatId);
  if (!userId) {
    await sendMessage(chatId, '🔗 Please link your account first with /link [code]');
    return;
  }

  const bookingId = args?.trim();
  if (!bookingId) {
    await sendMessage(chatId, '⚠️ Usage: <code>/details BOOKING_ID</code>\n\nUse /appointments or /history to find your booking IDs.');
    return;
  }

  try {
    const { data: booking, error } = await getBookingById(bookingId);
    if (error || !booking) {
      await sendMessage(chatId, '❌ Booking not found.');
      return;
    }

    // Verify this booking belongs to the user
    if (booking.client_id !== userId) {
      await sendMessage(chatId, '❌ Booking not found.');
      return;
    }

    const startsAt = new Date(booking.starts_at);
    const endsAt = new Date(booking.ends_at);
    const dateStr = startsAt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = `${startsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} – ${endsAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

    const statusIcons: Record<string, string> = {
      completed: '✅ Completed',
      cancelled: '❌ Cancelled',
      scheduled: '📅 Scheduled',
      confirmed: '✅ Confirmed',
      no_show: '⚠️ No Show',
    };

    const paymentIcons: Record<string, string> = {
      captured: '💳 Paid',
      pending: '⏳ Pending',
      failed: '❌ Failed',
      refunded: '💰 Refunded',
    };

    const lines = [
      '📋 <b>Booking Details</b>',
      '',
      `💆 <b>${booking.service?.name ?? 'Unknown Service'}</b>`,
      booking.service?.description ? `<i>${booking.service.description}</i>` : '',
      '',
      `📅 ${dateStr}`,
      `🕐 ${timeStr}`,
      `⏱ ${booking.duration_minutes ?? booking.service?.duration ?? '—'} minutes`,
      '',
      `Status: ${statusIcons[booking.status] ?? booking.status}`,
      `Payment: ${paymentIcons[booking.payment_status] ?? booking.payment_status ?? '—'}`,
      booking.base_price_cents ? `💰 ${(booking.base_price_cents / 100).toFixed(2)} EUR` : '',
      '',
      `<code>ID: ${booking.id}</code>`,
    ].filter(Boolean);

    const actionButtons: TelegramInlineKeyboardButton[][] = [];

    if (['scheduled', 'confirmed'].includes(booking.status)) {
      actionButtons.push([
        { text: '🔄 Reschedule', callback_data: `reschedule:${booking.id}` },
        { text: '❌ Cancel', callback_data: `cancel_ask:${booking.id}` },
      ]);
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      actionButtons.push([
        { text: '🔄 Rebook This Service', callback_data: `rebook:${booking.service_id ?? booking.serviceId}` },
      ]);
    }

    actionButtons.push([
      { text: '📋 My Appointments', callback_data: 'my_appointments' },
      { text: '📚 History', callback_data: 'my_history' },
    ]);

    await sendMessage(chatId, lines.join('\n'), {
      replyMarkup: { inline_keyboard: actionButtons },
    });
  } catch (error) {
    console.error('[Telegram] handleDetailsCommand error:', error);
    await sendMessage(chatId, '⚠️ Unable to load booking details. Please try again.');
  }
}

// ─── /wallet Command ──────────────────────────────────────────

async function handleWalletCommand(chatId: number, from: any) {
  const userId = await resolveLinkedUser(chatId);
  if (!userId) {
    await sendMessage(chatId, '🔗 Please link your account first with /link [code]');
    return;
  }

  try {
    const wallet = await getWallet(userId);
    const balanceFormatted = ((wallet.balanceCents ?? 0) / 100).toFixed(2);
    const currency = wallet.currency ?? 'EUR';

    await sendMessage(chatId, [
      '💰 <b>Your Wallet</b>',
      '',
      `💳 Balance: <b>${balanceFormatted} ${currency}</b>`,
      `⭐ Loyalty Points: <b>${wallet.pointsBalance ?? 0}</b>`,
      '',
      'Earn points with every booking!',
    ].join('\n'), {
      replyMarkup: {
        inline_keyboard: [
          [
            { text: '📅 Book & Earn Points', callback_data: 'services_list' },
          ],
          [
            { text: '🌐 Wallet Details', web_app: { url: `${siteUrl()}/dashboard/wallet` } },
          ],
        ],
      },
    });
  } catch (error) {
    console.error('[Telegram] handleWalletCommand error:', error);
    await sendMessage(chatId, '⚠️ Unable to load wallet. Please try again.');
  }
}

// ─── /mood Command ────────────────────────────────────────────

const MOOD_EMOJIS: Record<string, string> = {
  '1': '😫', '2': '😢', '3': '😔', '4': '😐', '5': '🙂',
  '6': '😊', '7': '😀', '8': '😄', '9': '🤩', '10': '🥳',
};

async function handleMoodCommand(chatId: number, from: any, args: string) {
  const userId = await resolveLinkedUser(chatId);
  if (!userId) {
    await sendMessage(chatId, '🔗 Please link your account first with /link [code]');
    return;
  }

  const parts = args?.trim().split(/\s+/) ?? [];
  const scoreStr = parts[0];
  const notes = parts.slice(1).join(' ') || undefined;

  // If no score provided, show mood selection buttons
  if (!scoreStr) {
    const rows: TelegramInlineKeyboardButton[][] = [
      [
        { text: '😫 1', callback_data: 'mood:1' },
        { text: '😢 2', callback_data: 'mood:2' },
        { text: '😔 3', callback_data: 'mood:3' },
        { text: '😐 4', callback_data: 'mood:4' },
        { text: '🙂 5', callback_data: 'mood:5' },
      ],
      [
        { text: '😊 6', callback_data: 'mood:6' },
        { text: '😀 7', callback_data: 'mood:7' },
        { text: '😄 8', callback_data: 'mood:8' },
        { text: '🤩 9', callback_data: 'mood:9' },
        { text: '🥳 10', callback_data: 'mood:10' },
      ],
    ];

    await sendMessage(chatId, [
      '🧘 <b>How are you feeling?</b>',
      '',
      'Tap a number to log your mood (1 = worst, 10 = best):',
    ].join('\n'), { replyMarkup: { inline_keyboard: rows } });
    return;
  }

  const score = parseInt(scoreStr, 10);
  if (isNaN(score) || score < 1 || score > 10) {
    await sendMessage(chatId, '⚠️ Mood score must be between 1 and 10. Example: <code>/mood 7 feeling great</code>');
    return;
  }

  try {
    const moodLabel = score <= 3 ? 'low' : score <= 6 ? 'neutral' : 'good';
    await personalizationService.logMood(userId, moodLabel, score, { notes });

    const emoji = MOOD_EMOJIS[String(score)] ?? '🙂';

    // Get recent trend
    const trend = await personalizationService.getMoodTrend(userId, 14);
    const trendIcon = trend.trend === 'improving' ? '📈' : trend.trend === 'declining' ? '📉' : '➡️';

    await sendMessage(chatId, [
      `${emoji} <b>Mood Logged: ${score}/10</b>`,
      notes ? `📝 "${notes}"` : '',
      '',
      trend.moods.length > 1 ? `${trendIcon} 14-day trend: <b>${trend.trend}</b> (avg: ${trend.averageScore})` : '',
      '',
      '💡 Track regularly for better wellness insights!',
    ].filter(Boolean).join('\n'), {
      replyMarkup: {
        inline_keyboard: [
          [{ text: '📊 View Mood History', web_app: { url: `${siteUrl()}/dashboard/insights` } }],
        ],
      },
    });
  } catch (error) {
    console.error('[Telegram] handleMoodCommand error:', error);
    await sendMessage(chatId, '⚠️ Unable to log mood. Please try again.');
  }
}

// ─── /resources Command ───────────────────────────────────────

const RESOURCE_ICONS: Record<string, string> = {
  article: '📖',
  video: '🎬',
  exercise: '🏋️',
  meditation: '🧘',
};

async function handleResourcesCommand(chatId: number, args: string) {
  try {
    const category = args?.trim().toLowerCase() || undefined;
    const validCategories = ['article', 'video', 'exercise', 'meditation'];
    const filterCategory = category && validCategories.includes(category) ? category : undefined;

    const resources = await getResources(filterCategory);

    if (!resources || resources.length === 0) {
      await sendMessage(chatId, '📚 No resources found. Check back later for wellness content!');
      return;
    }

    const lines = [
      `📚 <b>Wellness Resources${filterCategory ? ` — ${filterCategory}` : ''}</b>`,
      '',
    ];

    const buttons: TelegramInlineKeyboardButton[][] = [];

    for (const r of resources.slice(0, 8)) {
      const icon = RESOURCE_ICONS[r.category] ?? '📄';
      const premium = r.isPremium ? ' ⭐' : '';
      lines.push(`${icon} <b>${r.title}</b>${premium}`);
      lines.push(`   ${r.description}`);
      lines.push('');

      if (r.videoUrl) {
        buttons.push([{ text: `${icon} ${r.title}`, url: r.videoUrl }]);
      } else {
        buttons.push([
          { text: `${icon} Read: ${r.title}`, web_app: { url: `${siteUrl()}/resources/${r.id}` } },
        ]);
      }
    }

    // Category filter buttons
    if (!filterCategory) {
      buttons.push([
        { text: '📖 Articles', callback_data: 'resources:article' },
        { text: '🎬 Videos', callback_data: 'resources:video' },
        { text: '🏋️ Exercise', callback_data: 'resources:exercise' },
        { text: '🧘 Meditation', callback_data: 'resources:meditation' },
      ]);
    } else {
      buttons.push([
        { text: '📚 All Resources', callback_data: 'resources:all' },
      ]);
    }

    await sendMessage(chatId, lines.join('\n'), {
      replyMarkup: { inline_keyboard: buttons },
    });
  } catch (error) {
    console.error('[Telegram] handleResourcesCommand error:', error);
    await sendMessage(chatId, '⚠️ Unable to load resources. Please try again.');
  }
}

// ─── /reschedule Command ──────────────────────────────────────

async function handleRescheduleCommand(chatId: number, from: any, args: string) {
  const userId = await resolveLinkedUser(chatId);
  if (!userId) {
    await sendMessage(chatId, '🔗 Please link your account first with /link [code]');
    return;
  }

  const bookingId = args?.trim();

  if (!bookingId) {
    // Show upcoming bookings so they can pick one
    await sendMessage(chatId, [
      '🔄 <b>Reschedule a Booking</b>',
      '',
      'Use <code>/reschedule BOOKING_ID</code> or pick from your appointments:',
    ].join('\n'));
    await handleAppointmentsCommand(chatId, from);
    return;
  }

  try {
    // Verify booking exists and belongs to user
    const { rows } = await db.query(
      `SELECT b.id, b.starts_at, s.name as service_name, s.slug as service_slug
       FROM bookings b JOIN service s ON b.service_id = s.id
       WHERE b.id = $1 AND b.client_id = $2 AND b.status IN ('scheduled', 'confirmed')`,
      [bookingId, userId]
    );

    if (rows.length === 0) {
      await sendMessage(chatId, '❌ Booking not found or cannot be rescheduled.');
      return;
    }

    const booking = rows[0]!;
    const date = new Date(booking.starts_at);
    const dateStr = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    await sendMessage(chatId, [
      '🔄 <b>Reschedule Booking</b>',
      '',
      `Service: <b>${booking.service_name}</b>`,
      `Current: ${dateStr} at ${timeStr}`,
      '',
      'Tap below to choose a new time:',
    ].join('\n'), {
      replyMarkup: {
        inline_keyboard: [
          [
            {
              text: '📅 Choose New Time',
              web_app: { url: `${siteUrl()}/booking/${booking.service_slug}?reschedule=${bookingId}` },
            },
          ],
          [
            { text: '❌ Cancel Instead', callback_data: `cancel_ask:${bookingId}` },
            { text: '🔙 Back', callback_data: 'my_appointments' },
          ],
        ],
      },
    });
  } catch (error) {
    console.error('[Telegram] handleRescheduleCommand error:', error);
    await sendMessage(chatId, '⚠️ Unable to process reschedule. Please try again.');
  }
}
