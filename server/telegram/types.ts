// ─── Telegram Bot Types & Constants ─────────────────────────
// Comprehensive type definitions for the Telegram Bot API integration.

// ─── Telegram Update Types ──────────────────────────────────

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  description?: string;
  invite_link?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  entities?: TelegramMessageEntity[];
  reply_to_message?: TelegramMessage;
  new_chat_members?: TelegramUser[];
  left_chat_member?: TelegramUser;
  new_chat_title?: string;
  forward_from_chat?: TelegramChat;
  forward_date?: number;
  views?: number;
}

export interface TelegramMessageEntity {
  type: 'mention' | 'hashtag' | 'bot_command' | 'url' | 'text_link' | 'bold' | 'italic' | 'code' | 'pre';
  offset: number;
  length: number;
  url?: string;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  chat_instance: string;
  data?: string;
}

export interface TelegramChatMemberUpdated {
  chat: TelegramChat;
  from: TelegramUser;
  date: number;
  old_chat_member: TelegramChatMember;
  new_chat_member: TelegramChatMember;
  invite_link?: { invite_link: string; name?: string };
}

export interface TelegramChatMember {
  user: TelegramUser;
  status: 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked';
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
  edited_channel_post?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
  my_chat_member?: TelegramChatMemberUpdated;
  chat_member?: TelegramChatMemberUpdated;
}

export interface TelegramWebAppInfo {
  url: string;
}

export interface TelegramInlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
  web_app?: TelegramWebAppInfo;
  login_url?: { url: string; forward_text?: string; bot_username?: string };
  switch_inline_query?: string;
  switch_inline_query_current_chat?: string;
}

export interface TelegramInlineKeyboardMarkup {
  inline_keyboard: TelegramInlineKeyboardButton[][];
}

export interface TelegramReplyKeyboardButton {
  text: string;
  request_contact?: boolean;
  request_location?: boolean;
  web_app?: TelegramWebAppInfo;
}

export interface TelegramReplyKeyboardMarkup {
  keyboard: TelegramReplyKeyboardButton[][];
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  input_field_placeholder?: string;
  selective?: boolean;
}

export interface TelegramReplyKeyboardRemove {
  remove_keyboard: true;
  selective?: boolean;
}

export type TelegramReplyMarkup =
  | TelegramInlineKeyboardMarkup
  | TelegramReplyKeyboardMarkup
  | TelegramReplyKeyboardRemove;

// ─── Telegram API Response Types ────────────────────────────

export interface TelegramApiResponse<T = unknown> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

export interface TelegramChatInfo extends TelegramChat {
  photo?: { small_file_id: string; big_file_id: string };
  bio?: string;
  has_private_forwards?: boolean;
  linked_chat_id?: number;
  permissions?: Record<string, boolean>;
  slow_mode_delay?: number;
  message_auto_delete_time?: number;
}

export interface TelegramChatMemberCount {
  count: number;
}

// ─── Database Model Types ───────────────────────────────────

export interface TelegramChannel {
  id: string;
  chat_id: number;
  title: string;
  username: string | null;
  type: 'channel' | 'group' | 'supergroup';
  description: string | null;
  member_count: number;
  invite_link: string | null;
  is_active: boolean;
  linked_chat_id: number | null;
  bot_is_admin: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TelegramPost {
  id: string;
  channel_id: string;
  message_id: number | null;
  content: string;
  parse_mode: 'HTML' | 'Markdown' | 'MarkdownV2';
  media_type: 'photo' | 'video' | 'document' | null;
  media_url: string | null;
  buttons: TelegramInlineKeyboardButton[][] | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'deleted';
  scheduled_at: string | null;
  published_at: string | null;
  error_message: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TelegramPostAnalytics {
  id: string;
  post_id: string;
  views: number;
  forwards: number;
  replies: number;
  reactions: Record<string, number>;
  link_clicks: number;
  recorded_at: string;
}

export interface TelegramChannelAnalytics {
  id: string;
  channel_id: string;
  date: string;
  member_count: number;
  new_members: number;
  left_members: number;
  messages_count: number;
  views_total: number;
  avg_post_reach: number;
  engagement_rate: number;
  created_at: string;
}

export interface TelegramBotCommand {
  id: string;
  telegram_user_id: number | null;
  chat_id: number | null;
  command: string;
  args: string | null;
  response_status: 'success' | 'error' | 'ignored';
  created_at: string;
}

export interface TelegramGroupMember {
  id: string;
  channel_id: string;
  telegram_user_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  status: 'member' | 'admin' | 'creator' | 'left' | 'kicked' | 'restricted';
  joined_at: string;
  left_at: string | null;
  linked_user_id: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Action Input Types ────────────────────────────────────

export interface CreatePostInput {
  channelId: string;
  content: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  mediaType?: 'photo' | 'video' | 'document' | null;
  mediaUrl?: string | null;
  buttons?: TelegramInlineKeyboardButton[][] | null;
  scheduledAt?: string | null;
}

export interface UpdatePostInput {
  postId: string;
  content?: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  buttons?: TelegramInlineKeyboardButton[][] | null;
  scheduledAt?: string | null;
}

export interface SendMessageInput {
  chatId: number;
  text: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  replyMarkup?: TelegramInlineKeyboardMarkup;
  disableWebPagePreview?: boolean;
}

// ─── Bot Commands Enum ──────────────────────────────────────

export const BOT_COMMANDS = {
  START: '/start',
  LINK: '/link',
  HELP: '/help',
  STATUS: '/status',
  UNLINK: '/unlink',
  BOOK: '/book',
  APPOINTMENTS: '/appointments',
  CANCEL: '/cancel',
  NOTIFICATIONS: '/notifications',
  HISTORY: '/history',
  DETAILS: '/details',
  WALLET: '/wallet',
  MOOD: '/mood',
  RESOURCES: '/resources',
  RESCHEDULE: '/reschedule',
  INFO: '/info',
  STATS: '/stats',
} as const;

export type BotCommand = (typeof BOT_COMMANDS)[keyof typeof BOT_COMMANDS];
