// ─── Notification Dispatcher ────────────────────────────────
// Unified multi-channel notification delivery (email, telegram, in-app).
// Telegram is simply another channel, same as email or push.

import { createAdminClient } from '@/lib/supabase/admin';
import { sendMessage } from '@/server/telegram/bot-api';
import { TransactionalEmailService } from '@/lib/platform/services/transactional-email-service';
import type { TelegramInlineKeyboardMarkup } from '@/server/telegram/types';

export type NotificationChannel = 'email' | 'telegram' | 'push' | 'in_app';

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'booking_created'
  | 'payment_received'
  | 'payment_failed'
  | 'session_notes'
  | 'promotion'
  | 'system';

/** Which user_notification_settings category maps to each notification type */
const TYPE_TO_CATEGORY: Record<NotificationType, string> = {
  booking_confirmed: 'booking',
  booking_cancelled: 'booking',
  booking_reminder: 'reminder',
  booking_created: 'booking',
  payment_received: 'updates',
  payment_failed: 'updates',
  session_notes: 'updates',
  promotion: 'marketing',
  system: 'security',
};

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  /** For Telegram: optional inline keyboard buttons */
  buttons?: TelegramInlineKeyboardMarkup;
  /** Optional reference entity (booking id, etc.) */
  referenceId?: string;
  /** Extra data for email templates */
  data?: Record<string, unknown>;
  /** Override channels (skip preference check) */
  forceChannels?: NotificationChannel[];
}

interface UserNotifPrefs {
  [key: string]: boolean | string | undefined;
}

/**
 * Send a notification through all enabled channels for the user.
 * Respects user_notification_settings per-category toggles.
 */
export async function dispatchNotification(payload: NotificationPayload): Promise<{
  sent: NotificationChannel[];
  failed: { channel: NotificationChannel; error: string }[];
}> {
  const supabase = createAdminClient();
  const sent: NotificationChannel[] = [];
  const failed: { channel: NotificationChannel; error: string }[] = [];

  // 1. Fetch user notification preferences
  const { data: prefs } = await supabase
    .from('user_notification_settings')
    .select('*')
    .eq('user_id', payload.userId)
    .single();

  const category = TYPE_TO_CATEGORY[payload.type] ?? 'updates';

  function isChannelEnabled(channel: NotificationChannel): boolean {
    if (payload.forceChannels?.includes(channel)) return true;
    if (!prefs) return channel !== 'telegram'; // default: all except telegram
    const key = `${category}_${channel}`;
    return (prefs as UserNotifPrefs)[key] !== false;
  }

  // 2. In-app notification (always attempt unless explicitly disabled)
  if (isChannelEnabled('in_app')) {
    try {
      await supabase.from('notifications').insert({
        user_id: payload.userId,
        type: mapToNotifTableType(payload.type),
        title: payload.title,
        message: payload.body,
        category,
        payload: { referenceId: payload.referenceId, ...payload.data },
        is_read: false,
        priority:
          payload.type.includes('cancel') || payload.type.includes('failed') ? 'high' : 'medium',
      });
      sent.push('in_app');
      await logDispatch(supabase, payload, 'in_app', true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      failed.push({ channel: 'in_app', error: msg });
      await logDispatch(supabase, payload, 'in_app', false, msg);
    }
  }

  // 3. Email
  if (isChannelEnabled('email')) {
    try {
      const emailType = mapToEmailType(payload.type);
      const result = await TransactionalEmailService.send({
        userId: payload.userId,
        type: emailType,
        subject: payload.title,
        data: { message: payload.body, ...payload.data },
      });
      if (result.success) {
        sent.push('email');
        await logDispatch(supabase, payload, 'email', true);
      } else {
        const msg = String(result.error ?? 'Email send failed');
        failed.push({ channel: 'email', error: msg });
        await logDispatch(supabase, payload, 'email', false, msg);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      failed.push({ channel: 'email', error: msg });
      await logDispatch(supabase, payload, 'email', false, msg);
    }
  }

  // 4. Telegram
  if (isChannelEnabled('telegram')) {
    try {
      // Look up user's linked Telegram chat
      const { data: link } = await supabase
        .from('telegram_links')
        .select('telegram_chat_id, is_verified')
        .eq('user_id', payload.userId)
        .eq('is_verified', true)
        .single();

      if (link?.telegram_chat_id) {
        const text = formatTelegramMessage(payload);
        await sendMessage(link.telegram_chat_id, text, {
          replyMarkup: payload.buttons,
          disableWebPagePreview: true,
        });
        sent.push('telegram');
        await logDispatch(supabase, payload, 'telegram', true);
      }
      // No linked account = silently skip (not an error)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      failed.push({ channel: 'telegram', error: msg });
      await logDispatch(supabase, payload, 'telegram', false, msg);
    }
  }

  return { sent, failed };
}

/**
 * Send a Telegram notification to a user by userId (convenience).
 * Skips if user has no linked Telegram or has telegram disabled.
 */
export async function sendTelegramNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  buttons?: TelegramInlineKeyboardMarkup,
  referenceId?: string
): Promise<boolean> {
  const result = await dispatchNotification({
    userId,
    type,
    title,
    body,
    buttons,
    referenceId,
    forceChannels: ['telegram'],
  });
  return result.sent.includes('telegram');
}

// ─── Helpers ────────────────────────────────────────────────

function formatTelegramMessage(payload: NotificationPayload): string {
  const icon = getIcon(payload.type);
  return `${icon} <b>${payload.title}</b>\n\n${payload.body}`;
}

function getIcon(type: NotificationType): string {
  switch (type) {
    case 'booking_confirmed':
      return '✅';
    case 'booking_cancelled':
      return '❌';
    case 'booking_reminder':
      return '⏰';
    case 'booking_created':
      return '📅';
    case 'payment_received':
      return '💳';
    case 'payment_failed':
      return '⚠️';
    case 'session_notes':
      return '📝';
    case 'promotion':
      return '🎉';
    case 'system':
      return 'ℹ️';
    default:
      return '🔔';
  }
}

function mapToNotifTableType(type: NotificationType): string {
  if (type.includes('cancel') || type.includes('failed')) return 'warning';
  if (type.includes('reminder')) return 'reminder';
  return 'info';
}

function mapToEmailType(type: NotificationType) {
  if (type.includes('reminder')) return 'reminder' as const;
  if (type.includes('session_notes')) return 'session_notes' as const;
  return 'notification' as const;
}

async function logDispatch(
  supabase: ReturnType<typeof createAdminClient>,
  payload: NotificationPayload,
  channel: NotificationChannel,
  delivered: boolean,
  errorMessage?: string
) {
  try {
    await supabase.from('notification_dispatch_log').insert({
      user_id: payload.userId,
      channel,
      notification_type: payload.type,
      reference_id: payload.referenceId || null,
      message_preview: payload.body.slice(0, 200),
      delivered,
      error_message: errorMessage || null,
    });
  } catch {
    // Don't let logging failures break notification delivery
  }
}
