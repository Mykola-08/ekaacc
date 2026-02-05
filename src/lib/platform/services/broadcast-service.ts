// Broadcast Service - Mass Communication
import { supabaseAdmin } from '@/lib/platform/supabase';
import { getResend } from '@/lib/platform/services/email-client';

export interface BroadcastMessage {
  subject: string;
  content: string;
  targetAudience?: 'all' | 'subscribers' | 'active' | 'tier';
  tierFilter?: string;
}

export interface BroadcastResult {
  success: boolean;
  count: number;
  error?: string;
}

export class BroadcastService {
  static async send(args: BroadcastMessage): Promise<BroadcastResult> {
    return this.sendBroadcast(args.subject, args.content, args.targetAudience, args.tierFilter);
  }

  static async sendBroadcast(
    subject: string,
    content: string,
    audience: 'all' | 'subscribers' | 'active' | 'tier' | string = 'all',
    tierFilter?: string,
    userId?: string,
    templateData?: any
  ): Promise<BroadcastResult> {
    try {
      // Build query for target users
      let query = supabaseAdmin
        .from('profiles')
        .select('id, email, name')
        .eq('email_notifications', true);

      if (audience === 'subscribers') {
        query = query.not('subscription_tier', 'is', null);
      } else if (audience === 'active') {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('last_active_at', thirtyDaysAgo);
      } else if (audience === 'tier' && tierFilter) {
        query = query.eq('subscription_tier', tierFilter);
      }

      const { data: users, error } = await query;

      if (error || !users?.length) {
        return { success: false, count: 0, error: error?.message || 'No recipients found' };
      }

      const resend = getResend();
      let sentCount = 0;

      // Send in batches to avoid rate limits
      const batchSize = 50;
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        const emails = batch.map((u) => u.email).filter(Boolean);

        if (emails.length > 0) {
          await resend.emails.send({
            from: 'Eka <notifications@resend.dev>',
            to: emails,
            subject,
            html: `<div style="font-family: sans-serif;">${content}</div>`,
          });
          sentCount += emails.length;
        }
      }

      // Record broadcast for analytics
      await supabaseAdmin.from('broadcasts').insert({
        subject,
        content,
        target_audience: audience,
        recipients_count: sentCount,
        sent_at: new Date().toISOString(),
      });

      return { success: true, count: sentCount };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, count: 0, error: message };
    }
  }
}
