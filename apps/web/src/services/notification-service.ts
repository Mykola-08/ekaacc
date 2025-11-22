import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';
import { EmailService } from './email-service';
import { Result } from '@/lib/result';
import { logger } from '@/lib/logger';

/**
 * Safely initialize Supabase client for notification service
 * @returns Supabase client or null if credentials are missing
 */
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    logger.warn('NotificationService: Supabase credentials missing; notification DB operations disabled.');
    return null;
  }
  return createClient(url, key);
}

// Initialize Web Push
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:support@ekaacc.com', // Replace with your email
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationCategory = 'marketing' | 'security' | 'updates';

/**
 * Payload for sending a notification
 */
export interface NotificationPayload {
  /** Target user ID */
  userId: string;
  /** Notification severity/type */
  type: NotificationType;
  /** Category for preference filtering */
  category: NotificationCategory;
  /** Notification title */
  title: string;
  /** Notification message body */
  message: string;
  /** Optional link for user action */
  link?: string;
  /** Additional metadata */
  metadata?: any;
  /** Bypass user preferences (for critical alerts) */
  force?: boolean;
}

/**
 * Result of notification send operation
 */
export interface NotificationResult {
  /** Number of channels that successfully delivered */
  successCount: number;
  /** Number of channels that failed */
  failureCount: number;
  /** Success status for each channel */
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
  };
  /** Errors encountered per channel */
  errors: Array<{
    channel: 'inApp' | 'email' | 'push';
    error: Error;
  }>;
}

/**
 * Multi-channel notification service
 * 
 * Handles delivery of notifications through:
 * - In-app notifications (database)
 * - Email notifications
 * - Push notifications (web push)
 * 
 * Respects user preferences unless force=true
 * 
 * @example
 * ```typescript
 * const result = await NotificationService.send({
 *   userId: 'user-123',
 *   type: 'info',
 *   category: 'updates',
 *   title: 'New Feature',
 *   message: 'Check out our new AI insights!',
 *   link: '/ai-insights'
 * });
 * 
 * if (Result.isOk(result)) {
 *   console.log(`Sent to ${result.value.successCount} channels`);
 * } else {
 *   console.error('Failed to send notification:', result.error);
 * }
 * ```
 */
export class NotificationService {
  /**
   * Send a notification through all enabled channels
   * @param payload - Notification details and preferences
   * @returns Result containing success/failure for each channel
   */
  static async send(
    payload: NotificationPayload
  ): Promise<Result<NotificationResult, Error>> {
    return Result.wrap(async () => {
      const notificationResult: NotificationResult = {
        successCount: 0,
        failureCount: 0,
        channels: {
          inApp: false,
          email: false,
          push: false,
        },
        errors: [],
      };

      // Fetch user preferences
      const prefsResult = await this.getUserPreferences(payload.userId, payload.force);
      const prefs = Result.unwrapOr(prefsResult, this.getDefaultPreferences());

      const category = payload.category;
      const sendInApp = payload.force || prefs[`${category}_in_app` as keyof typeof prefs];
      const sendEmail = payload.force || prefs[`${category}_email` as keyof typeof prefs];
      const sendPush = payload.force || prefs[`${category}_push` as keyof typeof prefs];

      // 1. Send In-App Notification
      if (sendInApp) {
        const inAppResult = await this.sendInAppNotification(payload);
        if (Result.isOk(inAppResult)) {
          notificationResult.channels.inApp = true;
          notificationResult.successCount++;
        } else {
          notificationResult.failureCount++;
          notificationResult.errors.push({
            channel: 'inApp',
            error: inAppResult.error,
          });
        }
      }

      // 2. Send Email
      if (sendEmail) {
        const emailResult = await this.sendEmailNotification(payload);
        if (Result.isOk(emailResult)) {
          notificationResult.channels.email = true;
          notificationResult.successCount++;
        } else {
          notificationResult.failureCount++;
          notificationResult.errors.push({
            channel: 'email',
            error: emailResult.error,
          });
        }
      }

      // 3. Send Push Notification
      if (sendPush) {
        const pushResult = await this.sendPushNotification(payload);
        if (Result.isOk(pushResult)) {
          notificationResult.channels.push = true;
          notificationResult.successCount++;
        } else {
          notificationResult.failureCount++;
          notificationResult.errors.push({
            channel: 'push',
            error: pushResult.error,
          });
        }
      }

      return notificationResult;
    });
  }

  /**
   * Get user notification preferences
   */
  private static async getUserPreferences(
    userId: string,
    force?: boolean
  ): Promise<Result<any, Error>> {
    if (force) {
      return Result.ok(this.getDefaultPreferences());
    }

    return Result.wrap(async () => {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('user_notification_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { ...this.getDefaultPreferences(), ...data };
    });
  }

  /**
   * Get default notification preferences
   */
  private static getDefaultPreferences() {
    return {
      marketing_email: true,
      marketing_push: true,
      marketing_in_app: true,
      security_email: true,
      security_push: true,
      security_in_app: true,
      updates_email: true,
      updates_push: true,
      updates_in_app: true,
    };
  }

  /**
   * Send in-app notification (database)
   */
  private static async sendInAppNotification(
    payload: NotificationPayload
  ): Promise<Result<void, Error>> {
    return Result.wrap(async () => {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { error } = await supabase.rpc('create_notification', {
        p_user_id: payload.userId,
        p_type: payload.type,
        p_title: payload.title,
        p_message: payload.message,
        p_link: payload.link,
        p_metadata: payload.metadata,
        p_category: payload.category,
      });

      if (error) throw error;
      logger.info('In-app notification sent', { userId: payload.userId, title: payload.title });
    });
  }

  /**
   * Send email notification
   */
  private static async sendEmailNotification(
    payload: NotificationPayload
  ): Promise<Result<void, Error>> {
    return Result.wrap(async () => {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(payload.userId);
      
      if (userError || !user || !user.email) {
        throw new Error('User email not found');
      }

      const emailResult = await EmailService.sendNotificationEmail(
        user.email,
        payload.title,
        payload.message,
        payload.link
      );

      if (!emailResult.success) {
        throw emailResult.error || new Error('Email send failed');
      }

      logger.info('Email notification sent', { userId: payload.userId, email: user.email });
    });
  }

  /**
   * Send push notification to all user devices
   */
  private static async sendPushNotification(
    payload: NotificationPayload
  ): Promise<Result<void, Error>> {
    return Result.wrap(async () => {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data: subscriptions, error: subError } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', payload.userId);

      if (subError) throw subError;

      if (!subscriptions || subscriptions.length === 0) {
        throw new Error('No push subscriptions found');
      }

      const pushPromises = subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        const notificationData = JSON.stringify({
          title: payload.title,
          body: payload.message,
          url: payload.link,
          icon: '/icon-192x192.png',
        });

        try {
          await webpush.sendNotification(pushSubscription, notificationData);
          return { success: true };
        } catch (error: any) {
          if (error.statusCode === 410) {
            // Subscription expired, remove it
            await supabase.from('push_subscriptions').delete().eq('id', sub.id);
            logger.info('Removed expired push subscription', { subscriptionId: sub.id });
          }
          return { success: false, error };
        }
      });

      const results = await Promise.all(pushPromises);
      const successCount = results.filter((r) => r.success).length;

      if (successCount === 0) {
        throw new Error('All push notifications failed');
      }

      logger.info('Push notifications sent', { 
        userId: payload.userId, 
        total: subscriptions.length, 
        successful: successCount 
      });
    });
  }
