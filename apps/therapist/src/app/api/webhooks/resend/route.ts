import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

/**
 * Webhook handler for Resend email events
 * 
 * Events supported:
 * - email.sent: Email was accepted by Resend
 * - email.delivered: Email was successfully delivered
 * - email.delivery_delayed: Delivery was delayed
 * - email.complained: Recipient marked as spam
 * - email.bounced: Email bounced (hard or soft)
 * - email.opened: Recipient opened the email
 * - email.clicked: Recipient clicked a link
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const payload = JSON.parse(body);

    // Verify webhook signature if secret is configured
    if (RESEND_WEBHOOK_SECRET) {
      const signature = request.headers.get('svix-signature');
      const timestamp = request.headers.get('svix-timestamp');
      const id = request.headers.get('svix-id');

      if (!signature || !timestamp || !id) {
        console.error('Missing Resend webhook headers');
        return NextResponse.json({ error: 'Invalid webhook' }, { status: 401 });
      }

      // Verify the signature
      const signedContent = `${id}.${timestamp}.${body}`;
      const expectedSignature = crypto
        .createHmac('sha256', RESEND_WEBHOOK_SECRET)
        .update(signedContent)
        .digest('base64');

      const signatures = signature.split(' ');
      const versionedSignatures = signatures.map(sig => {
        const [version, hash] = sig.split(',');
        return hash;
      });

      if (!versionedSignatures.includes(expectedSignature)) {
        console.error('Invalid Resend webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const { type, data, created_at } = payload;

    // Extract common fields
    const emailId = data.email_id;
    const to = data.to?.[0] || data.to;
    const from = data.from;
    const subject = data.subject;

    // Log the event
    console.log(`Resend webhook: ${type}`, {
      emailId,
      to,
      subject,
      created_at
    });

    // Store event in database
    const eventData: any = {
      event_type: type,
      email_id: emailId,
      recipient: to,
      sender: from,
      subject: subject,
      created_at: created_at || new Date().toISOString(),
      raw_data: data
    };

    // Add event-specific data
    switch (type) {
      case 'email.bounced':
        eventData.bounce_type = data.bounce_type; // 'hard' or 'soft'
        eventData.bounce_reason = data.reason;
        
        // Mark user as bounced to prevent future sends
        if (to) {
          await supabase
            .from('user_notification_settings')
            .update({ email_bounced: true, email_bounce_reason: data.reason })
            .eq('user_id', (await getUserIdFromEmail(to)));
        }
        break;

      case 'email.complained':
        // Mark user as complained (spam complaint)
        if (to) {
          await supabase
            .from('user_notification_settings')
            .update({ 
              marketing_email: false,
              promotional_email: false,
              spam_complaint: true 
            })
            .eq('user_id', (await getUserIdFromEmail(to)));
        }
        break;

      case 'email.opened':
        eventData.opened_at = data.opened_at;
        eventData.user_agent = data.user_agent;
        break;

      case 'email.clicked':
        eventData.click_url = data.click?.url;
        eventData.clicked_at = data.clicked_at;
        break;
    }

    // Insert event record
    const { error: insertError } = await supabase
      .from('email_events')
      .insert(eventData);

    if (insertError) {
      console.error('Error storing email event:', insertError);
      // Don't fail the webhook - we've logged it
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resend webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Helper to get user ID from email address
 */
async function getUserIdFromEmail(email: string): Promise<string | null> {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  return data?.id || null;
}

// GET endpoint for verification (optional)
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    endpoint: 'Resend webhook handler' 
  });
}
