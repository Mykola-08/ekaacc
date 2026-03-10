// ─── Telegram Service Layer ─────────────────────────────────
// Core business logic for managing Telegram channels, groups, posts.
// Uses Supabase admin client (bypasses RLS) for webhook/service operations.

import { createClient } from '@/lib/supabase/admin';
import * as botApi from './bot-api';
import type {
  TelegramChannel,
  TelegramPost,
  CreatePostInput,
  UpdatePostInput,
  TelegramGroupMember,
  TelegramInlineKeyboardMarkup,
} from './types';

function getSupabase() {
  return createClient();
}

// ─── Channel / Group Management ─────────────────────────────

/**
 * Register a channel or group the bot has been added to.
 * Fetches live info from Telegram and upserts into the DB.
 */
export async function registerChannel(chatId: number, createdBy?: string): Promise<TelegramChannel | null> {
  const supabase = getSupabase();

  // Fetch live info from Telegram
  const chatRes = await botApi.getChat(chatId);
  if (!chatRes.ok || !chatRes.result) return null;

  const chat = chatRes.result;
  const countRes = await botApi.getChatMemberCount(chatId);
  const memberCount = countRes.ok ? countRes.result ?? 0 : 0;

  // Check if bot is admin
  const meRes = await botApi.getMe();
  let botIsAdmin = false;
  if (meRes.ok && meRes.result) {
    const memberRes = await botApi.getChatMember(chatId, meRes.result.id);
    botIsAdmin = memberRes.ok
      ? ['administrator', 'creator'].includes(memberRes.result?.status ?? '')
      : false;
  }

  const { data, error } = await supabase
    .from('telegram_channels')
    .upsert(
      {
        chat_id: chatId,
        title: chat.title ?? `Private ${chat.type}`,
        username: chat.username ?? null,
        type: chat.type === 'private' ? 'group' : chat.type,
        description: chat.description ?? null,
        member_count: memberCount,
        invite_link: chat.invite_link ?? null,
        linked_chat_id: chat.linked_chat_id ?? null,
        bot_is_admin: botIsAdmin,
        is_active: true,
        created_by: createdBy ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'chat_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('[TelegramService] registerChannel error:', error);
    return null;
  }

  return data as TelegramChannel;
}

/** List all registered channels/groups. */
export async function listChannels(activeOnly = true): Promise<TelegramChannel[]> {
  const supabase = getSupabase();
  let query = supabase
    .from('telegram_channels')
    .select('*')
    .order('created_at', { ascending: false });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[TelegramService] listChannels error:', error);
    return [];
  }
  return (data ?? []) as TelegramChannel[];
}

/** Refresh channel info from Telegram API. */
export async function refreshChannel(channelId: string): Promise<TelegramChannel | null> {
  const supabase = getSupabase();
  const { data: channel } = await supabase
    .from('telegram_channels')
    .select('chat_id')
    .eq('id', channelId)
    .single();

  if (!channel) return null;
  return registerChannel(channel.chat_id);
}

/** Deactivate a channel (soft delete). */
export async function deactivateChannel(channelId: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('telegram_channels')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', channelId);

  return !error;
}

/** Get a single channel by ID. */
export async function getChannel(channelId: string): Promise<TelegramChannel | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('telegram_channels')
    .select('*')
    .eq('id', channelId)
    .single();

  if (error) return null;
  return data as TelegramChannel;
}

// ─── Post Management ────────────────────────────────────────

/** Create a draft or scheduled post. */
export async function createPost(input: CreatePostInput, createdBy: string): Promise<TelegramPost | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('telegram_posts')
    .insert({
      channel_id: input.channelId,
      content: input.content,
      parse_mode: input.parseMode ?? 'HTML',
      media_type: input.mediaType ?? null,
      media_url: input.mediaUrl ?? null,
      buttons: input.buttons ?? null,
      status: input.scheduledAt ? 'scheduled' : 'draft',
      scheduled_at: input.scheduledAt ?? null,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) {
    console.error('[TelegramService] createPost error:', error);
    return null;
  }
  return data as TelegramPost;
}

/** Update an existing draft/scheduled post. */
export async function updatePost(input: UpdatePostInput): Promise<TelegramPost | null> {
  const supabase = getSupabase();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (input.content !== undefined) updates.content = input.content;
  if (input.parseMode !== undefined) updates.parse_mode = input.parseMode;
  if (input.buttons !== undefined) updates.buttons = input.buttons;
  if (input.scheduledAt !== undefined) {
    updates.scheduled_at = input.scheduledAt;
    updates.status = input.scheduledAt ? 'scheduled' : 'draft';
  }

  const { data, error } = await supabase
    .from('telegram_posts')
    .update(updates)
    .eq('id', input.postId)
    .in('status', ['draft', 'scheduled'])
    .select()
    .single();

  if (error) {
    console.error('[TelegramService] updatePost error:', error);
    return null;
  }
  return data as TelegramPost;
}

/** Publish a post immediately to the linked Telegram channel. */
export async function publishPost(postId: string): Promise<TelegramPost | null> {
  const supabase = getSupabase();

  // Fetch post + channel
  const { data: post } = await supabase
    .from('telegram_posts')
    .select('*, telegram_channels!inner(chat_id)')
    .eq('id', postId)
    .in('status', ['draft', 'scheduled'])
    .single();

  if (!post) return null;

  const chatId = (post as any).telegram_channels.chat_id;
  let replyMarkup: TelegramInlineKeyboardMarkup | undefined;
  if (post.buttons && Array.isArray(post.buttons) && post.buttons.length > 0) {
    replyMarkup = { inline_keyboard: post.buttons };
  }

  let result;
  if (post.media_type === 'photo' && post.media_url) {
    result = await botApi.sendPhoto(chatId, post.media_url, {
      caption: post.content,
      parseMode: post.parse_mode,
      replyMarkup,
    });
  } else if (post.media_type === 'document' && post.media_url) {
    result = await botApi.sendDocument(chatId, post.media_url, {
      caption: post.content,
      parseMode: post.parse_mode,
      replyMarkup,
    });
  } else {
    result = await botApi.sendMessage(chatId, post.content, {
      parseMode: post.parse_mode,
      replyMarkup,
      disableWebPagePreview: false,
    });
  }

  if (result.ok && result.result) {
    const { data: updated } = await supabase
      .from('telegram_posts')
      .update({
        status: 'published',
        message_id: result.result.message_id,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .select()
      .single();

    return updated as TelegramPost;
  } else {
    await supabase
      .from('telegram_posts')
      .update({
        status: 'failed',
        error_message: result.description ?? 'Unknown error',
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId);

    return null;
  }
}

/** Delete a post (soft/hard). */
export async function deletePost(postId: string): Promise<boolean> {
  const supabase = getSupabase();

  // If published, also delete from Telegram
  const { data: post } = await supabase
    .from('telegram_posts')
    .select('message_id, channel_id, telegram_channels!inner(chat_id)')
    .eq('id', postId)
    .single();

  if (post?.message_id) {
    const chatId = (post as any).telegram_channels.chat_id;
    await botApi.deleteMessage(chatId, post.message_id);
  }

  const { error } = await supabase
    .from('telegram_posts')
    .update({ status: 'deleted', updated_at: new Date().toISOString() })
    .eq('id', postId);

  return !error;
}

/** List posts for a channel. */
export async function listPosts(
  channelId: string,
  status?: string,
  limit = 50
): Promise<TelegramPost[]> {
  const supabase = getSupabase();
  let query = supabase
    .from('telegram_posts')
    .select('*')
    .eq('channel_id', channelId)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as TelegramPost[];
}

/** Publish all scheduled posts that are overdue. */
export async function publishScheduledPosts(): Promise<number> {
  const supabase = getSupabase();
  const now = new Date().toISOString();

  const { data: duePosts } = await supabase
    .from('telegram_posts')
    .select('id')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now);

  if (!duePosts || duePosts.length === 0) return 0;

  let published = 0;
  for (const post of duePosts) {
    const result = await publishPost(post.id);
    if (result) published++;
  }
  return published;
}

// ─── Group Member Tracking ──────────────────────────────────

/** Upsert a group member record. */
export async function trackMember(
  channelId: string,
  telegramUserId: number,
  info: { username?: string; firstName?: string; lastName?: string; status?: string }
): Promise<void> {
  const supabase = getSupabase();

  const record: Record<string, unknown> = {
    channel_id: channelId,
    telegram_user_id: telegramUserId,
    updated_at: new Date().toISOString(),
  };

  if (info.username) record.username = info.username;
  if (info.firstName) record.first_name = info.firstName;
  if (info.lastName) record.last_name = info.lastName;
  if (info.status) {
    record.status = info.status;
    if (['left', 'kicked'].includes(info.status)) {
      record.left_at = new Date().toISOString();
    }
  }

  await supabase
    .from('telegram_group_members')
    .upsert(record, { onConflict: 'channel_id,telegram_user_id' });
}

/** Get group members for a channel. */
export async function listGroupMembers(
  channelId: string,
  activeOnly = true,
  limit = 100
): Promise<TelegramGroupMember[]> {
  const supabase = getSupabase();
  let query = supabase
    .from('telegram_group_members')
    .select('*')
    .eq('channel_id', channelId)
    .order('joined_at', { ascending: false })
    .limit(limit);

  if (activeOnly) {
    query = query.in('status', ['member', 'admin', 'creator']);
  }

  const { data } = await query;
  return (data ?? []) as TelegramGroupMember[];
}

// ─── Bot Command Logging ────────────────────────────────────

export async function logBotCommand(
  telegramUserId: number | null,
  chatId: number | null,
  command: string,
  args: string | null,
  status: 'success' | 'error' | 'ignored' = 'success'
): Promise<void> {
  const supabase = getSupabase();
  await supabase.from('telegram_bot_commands').insert({
    telegram_user_id: telegramUserId,
    chat_id: chatId,
    command,
    args,
    response_status: status,
  });
}

// ─── Webhook Event Logging ──────────────────────────────────

export async function logWebhookEvent(
  updateId: number,
  eventType: string,
  payload: unknown
): Promise<void> {
  const supabase = getSupabase();
  await supabase.from('telegram_webhook_events').insert({
    update_id: updateId,
    event_type: eventType,
    payload,
  });
}

// ─── Channel Admin Actions via Bot API ──────────────────────

export async function pinChannelMessage(channelId: string, messageId: number): Promise<boolean> {
  const channel = await getChannel(channelId);
  if (!channel) return false;
  const result = await botApi.pinChatMessage(channel.chat_id, messageId);
  return result.ok === true;
}

export async function unpinChannelMessage(channelId: string, messageId?: number): Promise<boolean> {
  const channel = await getChannel(channelId);
  if (!channel) return false;
  const result = await botApi.unpinChatMessage(channel.chat_id, messageId);
  return result.ok === true;
}

export async function updateChannelTitle(channelId: string, title: string): Promise<boolean> {
  const channel = await getChannel(channelId);
  if (!channel) return false;
  const result = await botApi.setChatTitle(channel.chat_id, title);
  if (result.ok) {
    const supabase = getSupabase();
    await supabase
      .from('telegram_channels')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', channelId);
  }
  return result.ok === true;
}

export async function updateChannelDescription(channelId: string, description: string): Promise<boolean> {
  const channel = await getChannel(channelId);
  if (!channel) return false;
  const result = await botApi.setChatDescription(channel.chat_id, description);
  if (result.ok) {
    const supabase = getSupabase();
    await supabase
      .from('telegram_channels')
      .update({ description, updated_at: new Date().toISOString() })
      .eq('id', channelId);
  }
  return result.ok === true;
}

export async function banMember(channelId: string, userId: number): Promise<boolean> {
  const channel = await getChannel(channelId);
  if (!channel) return false;
  const result = await botApi.banChatMember(channel.chat_id, userId);
  if (result.ok) {
    await trackMember(channelId, userId, { status: 'kicked' });
  }
  return result.ok === true;
}

export async function unbanMember(channelId: string, userId: number): Promise<boolean> {
  const channel = await getChannel(channelId);
  if (!channel) return false;
  const result = await botApi.unbanChatMember(channel.chat_id, userId);
  return result.ok === true;
}

export async function getInviteLink(channelId: string): Promise<string | null> {
  const channel = await getChannel(channelId);
  if (!channel) return null;
  const result = await botApi.exportChatInviteLink(channel.chat_id);
  if (result.ok && result.result) {
    const supabase = getSupabase();
    await supabase
      .from('telegram_channels')
      .update({ invite_link: result.result, updated_at: new Date().toISOString() })
      .eq('id', channelId);
    return result.result;
  }
  return null;
}

// ─── Group-specific Admin Actions ───────────────────────

/** Promote a member to admin in a group. */
export async function promoteMember(
  channelId: string,
  userId: number,
  rights?: Parameters<typeof botApi.promoteChatMember>[2]
): Promise<boolean> {
  const channel = await getChannel(channelId);
  if (!channel) return false;
  const result = await botApi.promoteChatMember(channel.chat_id, userId, rights);
  if (result.ok) {
    await trackMember(channelId, userId, { status: 'admin' });
  }
  return result.ok === true;
}

/** Demote an admin back to regular member. */
export async function demoteMember(channelId: string, userId: number): Promise<boolean> {
  const channel = await getChannel(channelId);
  if (!channel) return false;
  // Promoting with all rights false effectively demotes
  const result = await botApi.promoteChatMember(channel.chat_id, userId, {
    canChangeInfo: false,
    canPostMessages: false,
    canEditMessages: false,
    canDeleteMessages: false,
    canInviteUsers: false,
    canRestrictMembers: false,
    canPinMessages: false,
    canPromoteMembers: false,
    canManageVideoChats: false,
    canManageChat: false,
  });
  if (result.ok) {
    await trackMember(channelId, userId, { status: 'member' });
  }
  return result.ok === true;
}

/** Restrict a group member's permissions. */
export async function restrictMember(
  channelId: string,
  userId: number,
  permissions: Record<string, boolean>,
  untilDate?: number
): Promise<boolean> {
  const channel = await getChannel(channelId);
  if (!channel) return false;
  const result = await botApi.restrictChatMember(channel.chat_id, userId, permissions, untilDate);
  if (result.ok) {
    await trackMember(channelId, userId, { status: 'restricted' });
  }
  return result.ok === true;
}

/** Set default group permissions for all members. */
export async function setGroupPermissions(
  channelId: string,
  permissions: Parameters<typeof botApi.setChatPermissions>[1]
): Promise<boolean> {
  const channel = await getChannel(channelId);
  if (!channel) return false;
  const result = await botApi.setChatPermissions(channel.chat_id, permissions);
  return result.ok === true;
}

/** Get list of admins from Telegram for a channel/group. */
export async function getAdmins(
  channelId: string
): Promise<Array<{ userId: number; username?: string; firstName: string; status: string }>> {
  const channel = await getChannel(channelId);
  if (!channel) return [];
  const result = await botApi.getChatAdministrators(channel.chat_id);
  if (!result.ok || !result.result) return [];
  return result.result.map((m) => ({
    userId: m.user.id,
    username: m.user.username,
    firstName: m.user.first_name,
    status: m.status,
  }));
}

/** Unpin all messages in a group. */
export async function unpinAllMessages(channelId: string): Promise<boolean> {
  const channel = await getChannel(channelId);
  if (!channel) return false;
  const result = await botApi.unpinAllChatMessages(channel.chat_id);
  return result.ok === true;
}

/** Leave a group (bot leaves). */
export async function leaveGroup(channelId: string): Promise<boolean> {
  const channel = await getChannel(channelId);
  if (!channel) return false;
  const result = await botApi.leaveChat(channel.chat_id);
  if (result.ok) {
    await deactivateChannel(channelId);
  }
  return result.ok === true;
}
