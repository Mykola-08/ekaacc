import { createClient } from '@supabase/supabase-js';
import { safeResend } from '@/lib/email';
import { render } from '@react-email/render';
import { NotificationEmail } from '@/emails/NotificationEmail';
import { ReminderEmail } from '@/emails/ReminderEmail';
import { ResultEmail } from '@/emails/ResultEmail';
import { HomeworkEmail } from '@/emails/HomeworkEmail';
import { SessionNotesEmail } from '@/emails/SessionNotesEmail';
import { CheckInEmail } from '@/emails/CheckInEmail';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
        console.warn('TransactionalEmailService: Supabase credentials missing; email preference checks disabled.');
        return null;
    }
    return createClient(url, key);
}

export type TransactionalEmailType = 'notification' | 'reminder' | 'result' | 'homework' | 'session_notes' | 'check_in';

interface SendOptions {
  userId: string;
  type: TransactionalEmailType;
  subject: string;
  data: any; // Props for the specific template
  force?: boolean; // Bypass preferences
}

export class TransactionalEmailService {
  
  static async renderOnly({ type, data, userName }: { type: TransactionalEmailType, data: any, userName: string }) {
      const unsubscribeUrl = '#'; // Dummy link for preview
      
      if (type === 'notification') {
          return render(NotificationEmail({ userName, title: data.title || 'Notification', message: data.message, actionLabel: data.actionLabel, actionUrl: data.actionUrl, unsubscribeUrl }));
      } else if (type === 'reminder') {
          return render(ReminderEmail({ userName, reminderTitle: data.subject || 'Reminder', reminderDetails: data.details, date: data.date, time: data.time, location: data.location, actionLabel: data.actionLabel, actionUrl: data.actionUrl, unsubscribeUrl }));
      } else if (type === 'result') {
          return render(ResultEmail({ userName, title: data.subject || 'Results', summary: data.summary, results: data.results, actionLabel: data.actionLabel, actionUrl: data.actionUrl, unsubscribeUrl }));
      } else if (type === 'homework') {
          return render(HomeworkEmail({ userName, therapistName: data.therapistName, assignmentTitle: data.assignmentTitle, description: data.description, dueDate: data.dueDate, actionLabel: data.actionLabel, actionUrl: data.actionUrl, unsubscribeUrl }));
      } else if (type === 'session_notes') {
          return render(SessionNotesEmail({ userName, therapistName: data.therapistName, sessionDate: data.sessionDate, summary: data.summary, keyTakeaways: data.keyTakeaways, nextSessionDate: data.nextSessionDate, unsubscribeUrl }));
      } else if (type === 'check_in') {
          return render(CheckInEmail({ userName, therapistName: data.therapistName, message: data.message, actionLabel: data.actionLabel, actionUrl: data.actionUrl, unsubscribeUrl }));
      }
      return '';
  }

  static async send({ userId, type, subject, data, force = false }: SendOptions) {
    // 1. Fetch user email and preferences
    const supabase = getSupabase();
    
    if (!supabase) {
        console.error('TransactionalEmailService: Supabase client not initialized');
        return { success: false, error: 'Supabase configuration missing' };
    }

    const { data: user, error: userError } = await supabase
      .from('users') // Assuming 'users' view or table exists wrapping auth.users, or use auth.admin
      .select('email, raw_user_meta_data')
      .eq('id', userId)
      .single();

    // Fallback to auth.users if 'users' table not available or empty
    let email = user?.email;
    let meta = user?.raw_user_meta_data || {};

    if (!email) {
        // Try fetching from auth.users via admin API if possible, or assume caller provided valid userId
        // Since we are using service key, we can query auth.users directly if we had the right permissions/setup
        // But typically we might have a public profiles table. 
        // Let's assume we can get it from a 'profiles' table or similar if 'users' fails.
        // For now, let's try to get it from 'user_notification_settings' joined with something? No.
        // Let's assume the caller might pass email, or we rely on a 'users' table sync.
        // If we can't get email, we can't send.
        console.error(`Could not find email for user ${userId}`);
        return { success: false, error: 'User email not found' };
    }

    // 2. Check preferences
    if (!force && supabase) {
        const { data: prefs } = await supabase
            .from('user_notification_settings')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        // Default to true if no prefs found
        const settings = prefs || {};
        
        // Map types to preference columns
        // notification -> updates_email (or a new 'notifications_email')
        // reminder -> updates_email (or 'reminders_email')
        // result -> product_updates_email (or 'results_email')
        
        // For now, let's map:
        // notification -> updates_email
        // reminder -> updates_email
        // result -> product_updates_email
        
        let allowed = true;
        if (type === 'notification' && settings.updates_email === false) allowed = false;
        if (type === 'reminder' && settings.updates_email === false) allowed = false;
        if (type === 'result' && settings.product_updates_email === false) allowed = false;
        // Therapist emails usually shouldn't be blocked by marketing prefs, but maybe 'updates'?
        // Let's assume therapist emails are critical/transactional unless specifically opted out.
        // We can add a 'therapist_updates_email' later. For now, allow them.

        if (!allowed) {
            console.log(`User ${userId} opted out of ${type} emails.`);
            return { success: false, skipped: true };
        }
    }

    // 3. Render Email
    const name = meta.full_name || meta.name || email.split('@')[0];
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
    
    let emailHtml;
    try {
        if (type === 'notification') {
            emailHtml = await render(NotificationEmail({
                userName: name,
                title: subject,
                message: data.message,
                actionLabel: data.actionLabel,
                actionUrl: data.actionUrl,
                unsubscribeUrl
            }));
        } else if (type === 'reminder') {
            emailHtml = await render(ReminderEmail({
                userName: name,
                reminderTitle: subject,
                reminderDetails: data.details,
                date: data.date,
                time: data.time,
                location: data.location,
                actionLabel: data.actionLabel,
                actionUrl: data.actionUrl,
                unsubscribeUrl
            }));
        } else if (type === 'result') {
            emailHtml = await render(ResultEmail({
                userName: name,
                title: subject,
                summary: data.summary,
                results: data.results,
                actionLabel: data.actionLabel,
                actionUrl: data.actionUrl,
                unsubscribeUrl
            }));
        } else if (type === 'homework') {
            emailHtml = await render(HomeworkEmail({
                userName: name,
                therapistName: data.therapistName,
                assignmentTitle: data.assignmentTitle,
                description: data.description,
                dueDate: data.dueDate,
                actionLabel: data.actionLabel,
                actionUrl: data.actionUrl,
                unsubscribeUrl
            }));
        } else if (type === 'session_notes') {
            emailHtml = await render(SessionNotesEmail({
                userName: name,
                therapistName: data.therapistName,
                sessionDate: data.sessionDate,
                summary: data.summary,
                keyTakeaways: data.keyTakeaways,
                nextSessionDate: data.nextSessionDate,
                unsubscribeUrl
            }));
        } else if (type === 'check_in') {
            emailHtml = await render(CheckInEmail({
                userName: name,
                therapistName: data.therapistName,
                message: data.message,
                actionLabel: data.actionLabel,
                actionUrl: data.actionUrl,
                unsubscribeUrl
            }));
        }
    } catch (renderError) {
        console.error('Error rendering email:', renderError);
        return { success: false, error: renderError };
    }

    // 4. Send via Resend
    try {
        const client = safeResend();
        if (!client) {
            console.warn('Resend not configured; skipping transactional email send.');
            return { success: false, skipped: true, reason: 'Resend not configured' };
        }
        const { data: resendData, error } = await client.emails.send({
            from: 'Ekaacc Notifications <notifications@ekaacc.com>',
            to: email,
            subject: subject,
            html: emailHtml!,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }

        return { success: true, data: resendData };
    } catch (e) {
        console.error('Send exception:', e);
        return { success: false, error: e };
    }
  }
}
