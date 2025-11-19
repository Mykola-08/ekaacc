import { createClient } from '@supabase/supabase-js';
import { resend } from '@/lib/email';
import { BroadcastEmail } from '@/emails/BroadcastEmail';
import { render } from '@react-email/render';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class BroadcastService {
  static async sendBroadcast(
    subject: string,
    content: string,
    groupId: string,
    adminUserId: string
  ) {
    // 1. Get users in the group
    let query = supabase
      .from('user_group_members')
      .select('user_id, auth:users(email, raw_user_meta_data)')
      .eq('group_id', groupId);

    // Special case for 'All Users' if we had a way to identify it, but for now we rely on group membership
    // If groupId corresponds to 'All Users', we might want to query auth.users directly, but let's stick to the group table for consistency.
    // Assuming 'All Users' group is populated via triggers or manual sync.
    // Alternatively, we can fetch all users if groupId is a specific constant.

    const { data: members, error } = await query;

    if (error) throw error;
    if (!members || members.length === 0) return { count: 0 };

    // 2. Filter by notification preferences
    // We need to fetch preferences for these users
    const userIds = members.map((m) => m.user_id);
    const { data: prefs } = await supabase
      .from('user_notification_settings')
      .select('user_id, marketing_email')
      .in('user_id', userIds);

    const prefsMap = new Map(prefs?.map((p) => [p.user_id, p.marketing_email]));

    let sentCount = 0;
    const errors = [];

    // 3. Send emails
    // In a real production app, we should use a queue (e.g. QStash, BullMQ) for this.
    // For now, we'll do it in batches.
    const BATCH_SIZE = 50;
    
    for (let i = 0; i < members.length; i += BATCH_SIZE) {
      const batch = members.slice(i, i + BATCH_SIZE);
      
      await Promise.all(
        batch.map(async (member: any) => {
          const userId = member.user_id;
          const email = member.auth?.email;
          const meta = member.auth?.raw_user_meta_data;
          const name = meta?.full_name || meta?.name || 'User';

          // Check preference
          if (prefsMap.has(userId) && !prefsMap.get(userId)) {
            return; // User opted out
          }

          if (!email) return;

          try {
            // Generate unsubscribe link
            // In a real app, sign this token. Here we just pass ID (insecure for production without signature)
            // Better: /api/unsubscribe?uid=USER_ID&sig=HMAC(USER_ID, SECRET)
            const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?uid=${userId}`;

            const emailHtml = await render(
              BroadcastEmail({
                subject,
                content,
                userName: name,
                unsubscribeUrl,
              })
            );

            await resend.emails.send({
              from: 'Ekaacc <updates@resend.dev>', // Use your verified domain
              to: email,
              subject: subject,
              html: emailHtml,
            });

            sentCount++;
          } catch (err) {
            console.error(`Failed to send to ${email}`, err);
            errors.push({ email, error: err });
          }
        })
      );
    }

    // 4. Log broadcast
    await supabase.from('broadcasts').insert({
      subject,
      content,
      group_id: groupId,
      created_by: adminUserId,
      sent_at: new Date().toISOString(),
    });

    return { count: sentCount, errors };
  }
}
