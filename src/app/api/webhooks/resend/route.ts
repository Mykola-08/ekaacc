import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { getResendWebhookSecret } from '@/lib/config';

// Define the incoming webhook payload type if needed
type ResendWebhookPayload = {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    to: string[];
    [key: string]: any;
  };
};

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const headersList = await headers();
    const svix_id = headersList.get('svix-id');
    const svix_timestamp = headersList.get('svix-timestamp');
    const svix_signature = headersList.get('svix-signature');

    // If there are no Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
    }

    const webhookSecret =
      process.env.RESEND_WEBHOOK_SECRET || (await getResendWebhookSecret().catch(() => ''));

    if (!webhookSecret) {
      console.warn('RESEND_WEBHOOK_SECRET is not set. Webhook verification skipped.');
      // Depending on your requirements, you might want to return 500 here.
    } else {
      const wh = new Webhook(webhookSecret);
      try {
        // Verify the webhook payload
        wh.verify(payload, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        });
      } catch (err: any) {
        console.error('Webhook signature verification failed.', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const event: ResendWebhookPayload = JSON.parse(payload);

    // Handle different event types
    switch (event.type) {
      case 'email.sent':
      case 'email.delivered':
      case 'email.delivery_delayed':
      case 'email.bounced':
      case 'email.complained':
      case 'email.opened':
      case 'email.clicked':
        console.log(`[Resend Webhook] Email ${event.type}:`, event.data.email_id);
        // Add your custom logic here, e.g., updating email status in database
        break;
      default:
        console.log(`[Resend Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Resend Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
