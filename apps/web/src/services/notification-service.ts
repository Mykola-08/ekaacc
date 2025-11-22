import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';
import { EmailService } from './email-service';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('NotificationService: Supabase credentials missing; notification DB operations disabled.');
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

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  link?: string;
  metadata?: any;
  force?: boolean; // Bypass preferences (e.g. for critical security alerts)
}

export class NotificationService {
  static async send(payload: NotificationPayload) {
    const results = {
      db: false,
      email: false,
      push: false,
      errors: [] as any[],
    };

    // Fetch user preferences
    let prefs = {
        marketing_email: true, marketing_push: true, marketing_in_app: true,
        security_email: true, security_push: true, security_in_app: true,
        updates_email: true, updates_push: true, updates_in_app: true
    };

    const supabase = getSupabase();
    if (!payload.force && supabase) {
      const { data: userPrefs } = await supabase
            .from('user_notification_settings')
            .select('*')
            .eq('user_id', payload.userId)
            .single();
        
        if (userPrefs) {
            prefs = { ...prefs, ...userPrefs };
        }
    }

    const category = payload.category;
    const sendInApp = payload.force || prefs[`${category}_in_app` as keyof typeof prefs];
    const sendEmail = payload.force || prefs[`${category}_email` as keyof typeof prefs];
    const sendPush = payload.force || prefs[`${category}_push` as keyof typeof prefs];

    // 1. Save to Database (In-App Notification)
    if (sendInApp) {
        try {
        if (supabase) {
        const { error } = await supabase.rpc('create_notification', {
            p_user_id: payload.userId,
            p_type: payload.type,
            p_title: payload.title,
            p_message: payload.message,
            p_link: payload.link,
            p_metadata: payload.metadata,
            p_category: category,
        });

        if (error) throw error;
        results.db = true;
        }
        } catch (error) {
        console.error('Error creating in-app notification:', error);
        results.errors.push({ source: 'db', error });
        }
    }

    // 2. Send Email
    if (sendEmail) {
      try {
        // Fetch user email
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase not configured');
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

        if (!emailResult.success) throw emailResult.error;
        results.email = true;
      } catch (error) {
        console.error('Error sending email notification:', error);
        results.errors.push({ source: 'email', error });
      }
    }

    // 3. Send Push Notification
    if (sendPush) {
      try {
        // Fetch user subscriptions
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase not configured');
        const { data: subscriptions, error: subError } = await supabase
          .from('push_subscriptions')
          .select('*')
          .eq('user_id', payload.userId);

        if (subError) throw subError;

        if (subscriptions && subscriptions.length > 0) {
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
              icon: '/icon-192x192.png', // Ensure this exists
            });

            try {
              await webpush.sendNotification(pushSubscription, notificationData);
              return { success: true };
            } catch (error: any) {
              if (error.statusCode === 410) {
                // Subscription expired, remove it
                await supabase.from('push_subscriptions').delete().eq('id', sub.id);
              }
              return { success: false, error };
            }
          });

          await Promise.all(pushPromises);
          results.push = true;
        }
      } catch (error) {
        console.error('Error sending push notification:', error);
        results.errors.push({ source: 'push', error });
      }
    }

    return results;
  }
}
