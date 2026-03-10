// ─── Telegram Bot API Client ────────────────────────────────
// Low-level wrapper around the Telegram Bot HTTP API.
// All methods return typed responses; callers decide on error handling.

import { getTelegramBotToken } from '@/lib/config';
import type {
  TelegramApiResponse,
  TelegramChatInfo,
  TelegramChatMember,
  TelegramInlineKeyboardMarkup,
  TelegramMessage,
  TelegramReplyMarkup,
  TelegramUser,
} from './types';

const TG_API_BASE = 'https://api.telegram.org';

let cachedToken: string | null = null;

async function getToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  cachedToken = await getTelegramBotToken();
  return cachedToken;
}

async function callApi<T>(method: string, body?: Record<string, unknown>): Promise<TelegramApiResponse<T>> {
  const token = await getToken();
  const url = `${TG_API_BASE}/bot${token}/${method}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = (await res.json()) as TelegramApiResponse<T>;

  if (!json.ok) {
    console.error(`[Telegram API] ${method} failed:`, json.description);
  }

  return json;
}

// ─── Bot Info ───────────────────────────────────────────────

export async function getMe(): Promise<TelegramApiResponse<TelegramUser>> {
  return callApi<TelegramUser>('getMe');
}

// ─── Messaging ──────────────────────────────────────────────

export async function sendMessage(
  chatId: number | string,
  text: string,
  options?: {
    parseMode?: string;
    replyMarkup?: TelegramReplyMarkup;
    disableWebPagePreview?: boolean;
    disableNotification?: boolean;
  }
): Promise<TelegramApiResponse<TelegramMessage>> {
  return callApi<TelegramMessage>('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: options?.parseMode ?? 'HTML',
    reply_markup: options?.replyMarkup,
    disable_web_page_preview: options?.disableWebPagePreview,
    disable_notification: options?.disableNotification,
  });
}

export async function editMessageText(
  chatId: number | string,
  messageId: number,
  text: string,
  options?: {
    parseMode?: string;
    replyMarkup?: TelegramInlineKeyboardMarkup;
  }
): Promise<TelegramApiResponse<TelegramMessage>> {
  // editMessageText only supports InlineKeyboardMarkup per Telegram API
  return callApi<TelegramMessage>('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: options?.parseMode ?? 'HTML',
    reply_markup: options?.replyMarkup,
  });
}

export async function deleteMessage(
  chatId: number | string,
  messageId: number
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('deleteMessage', {
    chat_id: chatId,
    message_id: messageId,
  });
}

export async function forwardMessage(
  chatId: number | string,
  fromChatId: number | string,
  messageId: number
): Promise<TelegramApiResponse<TelegramMessage>> {
  return callApi<TelegramMessage>('forwardMessage', {
    chat_id: chatId,
    from_chat_id: fromChatId,
    message_id: messageId,
  });
}

// ─── Media ──────────────────────────────────────────────────

export async function sendPhoto(
  chatId: number | string,
  photo: string, // URL or file_id
  options?: {
    caption?: string;
    parseMode?: string;
    replyMarkup?: TelegramReplyMarkup;
  }
): Promise<TelegramApiResponse<TelegramMessage>> {
  return callApi<TelegramMessage>('sendPhoto', {
    chat_id: chatId,
    photo,
    caption: options?.caption,
    parse_mode: options?.parseMode ?? 'HTML',
    reply_markup: options?.replyMarkup,
  });
}

export async function sendDocument(
  chatId: number | string,
  document: string,
  options?: {
    caption?: string;
    parseMode?: string;
    replyMarkup?: TelegramReplyMarkup;
  }
): Promise<TelegramApiResponse<TelegramMessage>> {
  return callApi<TelegramMessage>('sendDocument', {
    chat_id: chatId,
    document,
    caption: options?.caption,
    parse_mode: options?.parseMode ?? 'HTML',
    reply_markup: options?.replyMarkup,
  });
}

// ─── Chat Management ────────────────────────────────────────

export async function getChat(chatId: number | string): Promise<TelegramApiResponse<TelegramChatInfo>> {
  return callApi<TelegramChatInfo>('getChat', { chat_id: chatId });
}

export async function getChatMemberCount(chatId: number | string): Promise<TelegramApiResponse<number>> {
  return callApi<number>('getChatMemberCount', { chat_id: chatId });
}

export async function getChatMember(
  chatId: number | string,
  userId: number
): Promise<TelegramApiResponse<TelegramChatMember>> {
  return callApi<TelegramChatMember>('getChatMember', {
    chat_id: chatId,
    user_id: userId,
  });
}

export async function getChatAdministrators(
  chatId: number | string
): Promise<TelegramApiResponse<TelegramChatMember[]>> {
  return callApi<TelegramChatMember[]>('getChatAdministrators', { chat_id: chatId });
}

export async function banChatMember(
  chatId: number | string,
  userId: number,
  untilDate?: number
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('banChatMember', {
    chat_id: chatId,
    user_id: userId,
    until_date: untilDate,
  });
}

export async function unbanChatMember(
  chatId: number | string,
  userId: number
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('unbanChatMember', {
    chat_id: chatId,
    user_id: userId,
    only_if_banned: true,
  });
}

export async function restrictChatMember(
  chatId: number | string,
  userId: number,
  permissions: Record<string, boolean>,
  untilDate?: number
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('restrictChatMember', {
    chat_id: chatId,
    user_id: userId,
    permissions,
    until_date: untilDate,
  });
}

export async function setChatTitle(
  chatId: number | string,
  title: string
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('setChatTitle', { chat_id: chatId, title });
}

export async function setChatDescription(
  chatId: number | string,
  description: string
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('setChatDescription', { chat_id: chatId, description });
}

export async function pinChatMessage(
  chatId: number | string,
  messageId: number,
  disableNotification?: boolean
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('pinChatMessage', {
    chat_id: chatId,
    message_id: messageId,
    disable_notification: disableNotification,
  });
}

export async function unpinChatMessage(
  chatId: number | string,
  messageId?: number
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('unpinChatMessage', {
    chat_id: chatId,
    message_id: messageId,
  });
}

export async function exportChatInviteLink(
  chatId: number | string
): Promise<TelegramApiResponse<string>> {
  return callApi<string>('exportChatInviteLink', { chat_id: chatId });
}

// ─── Webhook Management ─────────────────────────────────────

export async function setWebhook(
  url: string,
  options?: {
    secretToken?: string;
    allowedUpdates?: string[];
    maxConnections?: number;
  }
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('setWebhook', {
    url,
    secret_token: options?.secretToken,
    allowed_updates: options?.allowedUpdates ?? [
      'message',
      'edited_message',
      'channel_post',
      'edited_channel_post',
      'callback_query',
      'my_chat_member',
      'chat_member',
    ],
    max_connections: options?.maxConnections ?? 40,
  });
}

export async function deleteWebhook(
  dropPendingUpdates?: boolean
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('deleteWebhook', {
    drop_pending_updates: dropPendingUpdates,
  });
}

export async function getWebhookInfo(): Promise<
  TelegramApiResponse<{
    url: string;
    has_custom_certificate: boolean;
    pending_update_count: number;
    last_error_date?: number;
    last_error_message?: string;
    max_connections?: number;
    allowed_updates?: string[];
  }>
> {
  return callApi('getWebhookInfo');
}

// ─── Callback Queries ───────────────────────────────────────

export async function answerCallbackQuery(
  callbackQueryId: string,
  options?: {
    text?: string;
    showAlert?: boolean;
    url?: string;
  }
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text: options?.text,
    show_alert: options?.showAlert,
    url: options?.url,
  });
}
// ─── Group Admin Methods ────────────────────────────────

export async function promoteChatMember(
  chatId: number | string,
  userId: number,
  rights?: {
    canChangeInfo?: boolean;
    canPostMessages?: boolean;
    canEditMessages?: boolean;
    canDeleteMessages?: boolean;
    canInviteUsers?: boolean;
    canRestrictMembers?: boolean;
    canPinMessages?: boolean;
    canPromoteMembers?: boolean;
    canManageVideoChats?: boolean;
    canManageChat?: boolean;
  }
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('promoteChatMember', {
    chat_id: chatId,
    user_id: userId,
    can_change_info: rights?.canChangeInfo,
    can_post_messages: rights?.canPostMessages,
    can_edit_messages: rights?.canEditMessages,
    can_delete_messages: rights?.canDeleteMessages,
    can_invite_users: rights?.canInviteUsers,
    can_restrict_members: rights?.canRestrictMembers,
    can_pin_messages: rights?.canPinMessages,
    can_promote_members: rights?.canPromoteMembers,
    can_manage_video_chats: rights?.canManageVideoChats,
    can_manage_chat: rights?.canManageChat,
  });
}

export async function setChatPermissions(
  chatId: number | string,
  permissions: {
    can_send_messages?: boolean;
    can_send_audios?: boolean;
    can_send_documents?: boolean;
    can_send_photos?: boolean;
    can_send_videos?: boolean;
    can_send_video_notes?: boolean;
    can_send_voice_notes?: boolean;
    can_send_polls?: boolean;
    can_send_other_messages?: boolean;
    can_add_web_page_previews?: boolean;
    can_change_info?: boolean;
    can_invite_users?: boolean;
    can_pin_messages?: boolean;
    can_manage_topics?: boolean;
  }
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('setChatPermissions', {
    chat_id: chatId,
    permissions,
  });
}

export async function unpinAllChatMessages(
  chatId: number | string
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('unpinAllChatMessages', { chat_id: chatId });
}

export async function leaveChat(
  chatId: number | string
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('leaveChat', { chat_id: chatId });
}
// ─── Bot Commands ───────────────────────────────────────────

export async function setMyCommands(
  commands: Array<{ command: string; description: string }>,
  scope?: { type: string; chat_id?: number | string; user_id?: number }
): Promise<TelegramApiResponse<boolean>> {
  return callApi<boolean>('setMyCommands', {
    commands,
    scope,
  });
}
