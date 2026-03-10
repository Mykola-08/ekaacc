import { createClient } from '@/lib/supabase/admin';
import { getTelegramSecretToken } from '@/lib/config';
import { NextResponse } from 'next/server';
import * as telegramService from '@/server/telegram/service';
import * as telegramAnalytics from '@/server/telegram/analytics';
import { sendMessage, answerCallbackQuery } from '@/server/telegram/bot-api';
import type { TelegramUpdate } from '@/server/telegram/types';

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

  if (!data) {
    await answerCallbackQuery(query.id);
    return;
  }

  // Route callback data to handlers
  if (data.startsWith('book:')) {
    const serviceSlug = data.replace('book:', '');
    await answerCallbackQuery(query.id, {
      text: `Opening booking for ${serviceSlug}...`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/booking/${serviceSlug}`,
    });
  } else {
    await answerCallbackQuery(query.id, { text: 'Action processed!' });
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
    '📊 <b>/status</b> — Check your account status',
    'ℹ️ <b>/info</b> — Channel/group info',
    '📈 <b>/stats</b> — Quick stats (admin groups)',
    '🔓 <b>/unlink</b> — Unlink your Telegram account',
    '❓ <b>/help</b> — Show this help message',
    '',
    '🌿 Start your wellness journey at <b>ekabalance.com</b>',
  ].join('\n'), {
    replyMarkup: {
      inline_keyboard: [[
        { text: '🌐 Visit EKA Balance', url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ekabalance.com' },
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
    '📖 <b>EKA Balance Bot — Commands</b>',
    '',
    '/start — Welcome message',
    '/link [code] — Link your account',
    '/status — Account & notification status',
    '/info — Group/channel info',
    '/stats — Quick analytics (admin)',
    '/unlink — Disconnect your account',
    '/help — This help message',
  ].join('\n'));
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
