import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { squareStripeSyncService } from '@/services/square-stripe-sync-service';

const SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

/**
 * Verify Square webhook signature
 */
function verifySignature(body: string, signature: string, url: string): boolean {
  if (!SIGNATURE_KEY) {
    console.error('SQUARE_WEBHOOK_SIGNATURE_KEY not configured');
    return false;
  }

  const hmac = crypto.createHmac('sha1', SIGNATURE_KEY);
  hmac.update(url + body);
  const hash = hmac.digest('base64');

  return hash === signature;
}

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-square-hmacsha1-signature');
    
    // Construct the full URL for verification
    // Note: In production, this should be the actual public URL
    const url = req.url;

    if (!signature || !verifySignature(bodyText, signature, url)) {
      // In development/testing, we might want to bypass this or log a warning
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      } else {
        console.warn('Webhook signature verification failed (ignored in dev)');
      }
    }

    const event = JSON.parse(bodyText);
    console.log('Received Square Webhook:', event.type);

    if (event.type === 'catalog.version.updated') {
      // Trigger sync
      // We don't await this to return a 200 OK quickly to Square
      squareStripeSyncService.syncServices().catch(err => {
        console.error('Background sync failed:', err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
