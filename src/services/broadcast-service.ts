import { createClient } from '@supabase/supabase-js';
import { resend } from '@/lib/email';
import { BroadcastEmail } from '@/emails/BroadcastEmail';
import { ProductLaunchEmail } from '@/emails/ProductLaunchEmail';
import { PromotionalEmail } from '@/emails/PromotionalEmail';
import { render } from '@react-email/render';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'service-role-placeholder';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Supabase environment variables are not fully set; using placeholder credentials.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export type BroadcastTopic = 'general' | 'marketing' | 'product_launch' | 'promotional';

export class BroadcastService {
  
  /**
   * Syncs a user to Resend Audiences (Contacts)
   * This is useful if you want to use Resend's dashboard for sending campaigns later.
   */
  static async syncUserToResend(email: string, firstName?: string, lastName?: string, unsubscribed: boolean = false) {
    try {
      // Create or update contact in Resend
      // We use the default audience (usually the one created with the account)
      // You can find your Audience ID in Resend Dashboard -> Audiences
      const audienceId = process.env.RESEND_AUDIENCE_ID; 
      
      if (!audienceId) {
        console.warn('RESEND_AUDIENCE_ID is not set. Skipping Resend sync.');
        return;
      }

      await resend.contacts.create({
        email,
        firstName,
        lastName,
        unsubscribed,
        audienceId,
      });
    } catch (error) {
      console.error('Error syncing user to Resend:', error);
    }
  }

  static async sendBroadcast(
    subject: string,
    content: string, // Or specific props for templates
    topic: BroadcastTopic,
    groupId: string,
    adminUserId: string,
    templateData?: any // Extra data for specific templates
  ) {
    if (
      supabaseUrl === 'https://placeholder.supabase.co' ||
      supabaseServiceKey === 'service-role-placeholder'
    ) {
      throw new Error('Supabase credentials are not configured for broadcast service.');
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not configured; skipping broadcast send.');
      return { count: 0, errors: ['Resend API key is missing'] };
    }

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

    // 2. Filter by notification preferences based on Topic
    const userIds = members.map((m) => m.user_id);
    
    // Determine which DB column to check
    let prefColumn = 'marketing_email'; // Default
    if (topic === 'product_launch') prefColumn = 'product_updates_email';
    if (topic === 'promotional') prefColumn = 'promotional_email';
    if (topic === 'general') prefColumn = 'marketing_email'; // Or a new 'general_email' if we had it

    const { data: prefs } = await supabase
      .from('user_notification_settings')
      .select(`user_id, ${prefColumn}`)
      .in('user_id', userIds);

    // Map user_id -> boolean (allowed)
    const prefsMap = new Map();
    prefs?.forEach((p) => {
        // @ts-ignore - dynamic access
        prefsMap.set(p.user_id, p[prefColumn]);
    });

    let sentCount = 0;
    const errors = [];

    // 3. Send emails in batches
    // In a real production app, we should use a queue (e.g. QStash, BullMQ) for this.
    // For now, we'll do it in batches.
    const BATCH_SIZE = 50;
    
    for (let i = 0; i < members.length; i += BATCH_SIZE) {
      const batch = members.slice(i, i + BATCH_SIZE);
      
      const emailBatchPromises = batch
        .filter((member) => {
            // Check preference. If undefined, assume TRUE (opt-in by default logic) or FALSE depending on policy.
            // Our DB migration set defaults to TRUE.
            const allowed = prefsMap.get(member.user_id);
            return allowed !== false; // Allow if true or undefined (though it should be true/false from DB)
        })
        .map(async (member) => {
          // @ts-ignore
          const email = member.auth?.email;
          // @ts-ignore
          const meta = member.auth?.raw_user_meta_data || {};
          const name = meta.full_name || meta.name || email?.split('@')[0];
          
          if (!email) return null;

          const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

          let emailHtml;
          
          if (topic === 'product_launch') {
             emailHtml = await render(ProductLaunchEmail({
                userName: name,
                productName: templateData?.productName || 'New Feature',
                productDescription: content,
                launchDate: templateData?.launchDate || new Date().toLocaleDateString(),
                ctaLink: templateData?.ctaLink || process.env.NEXT_PUBLIC_APP_URL!,
                ctaText: templateData?.ctaText,
                unsubscribeUrl
             }));
          } else if (topic === 'promotional') {
             emailHtml = await render(PromotionalEmail({
                userName: name,
                offerTitle: subject,
                offerDetails: content,
                promoCode: templateData?.promoCode,
                validUntil: templateData?.validUntil,
                ctaLink: templateData?.ctaLink || process.env.NEXT_PUBLIC_APP_URL!,
                ctaText: templateData?.ctaText,
                unsubscribeUrl
             }));
          } else {
             // Default / General / Marketing
             emailHtml = await render(BroadcastEmail({
                userName: name,
                subject,
                content,
                unsubscribeUrl
             }));
          }

          return {
            from: 'Ekaacc <updates@ekaacc.com>', // Configure your verified domain
            to: email,
            subject: subject,
            html: emailHtml,
          };
        });

      const emailBatch = (await Promise.all(emailBatchPromises)).filter(Boolean);

      if (emailBatch.length > 0) {
        try {
            // @ts-ignore - Resend batch types might need strict checking
            const { data, error } = await resend.emails.batch.send(emailBatch);
            if (error) {
                console.error('Batch send error:', error);
                errors.push(error);
            } else {
                sentCount += emailBatch.length;
            }
        } catch (e) {
            console.error('Batch exception:', e);
            errors.push(e);
        }
      }
    }

    // 4. Log the broadcast in DB
    await supabase.from('broadcasts').insert({
        subject,
        content,
        group_id: groupId,
        sent_by: adminUserId,
        recipient_count: sentCount,
        topic: topic,
        metadata: templateData
    });

    return { count: sentCount, errors };
  }
}
