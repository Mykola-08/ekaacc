import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import type { SquareWebhookEvent } from '@/types/square';

/**
 * Square Webhook Handler
 * 
 * Handles webhook events from Square for:
 * - Payment events (payment.created, payment.updated)
 * - Booking events (booking.created, booking.updated)
 * - Customer events (customer.created, customer.updated)
 * 
 * Setup Instructions:
 * 1. Set SQUARE_WEBHOOK_SIGNATURE_KEY in environment variables
 * 2. Configure webhook URL in Square Dashboard: https://your-domain.com/api/webhooks/square
 * 3. Subscribe to desired event types
 * 
 * Security:
 * - Verifies webhook signature to ensure authenticity
 * - Rejects requests without valid signatures
 */

const SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

/**
 * Verify Square webhook signature
 * https://developer.squareup.com/docs/webhooks/step3validate
 */
function verifySignature(body: string, signature: string, url: string): boolean {
  if (!SIGNATURE_KEY) {
    console.error('SQUARE_WEBHOOK_SIGNATURE_KEY not configured');
    return false;
  }

  try {
    // Square signature format: signature + url + body
    const payload = url + body;
    const hmac = crypto.createHmac('sha256', SIGNATURE_KEY);
    hmac.update(payload);
    const hash = hmac.digest('base64');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(hash)
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Handle payment events
 */
async function handlePaymentEvent(event: SquareWebhookEvent): Promise<void> {
  const { type, data } = event;

  console.log(`Processing payment event: ${type}`, {
    eventId: event.eventId,
    paymentId: data?.id,
  });

  switch (type) {
    case 'payment.created':
      // Handle new payment
      // TODO: Update order status, send confirmation email, etc.
      console.log('Payment created:', data?.id);
      break;

    case 'payment.updated':
      // Handle payment update (status change, refund, etc.)
      // TODO: Update payment status in database
      console.log('Payment updated:', data?.id);
      break;

    case 'payment.completed':
      // Handle completed payment
      // TODO: Fulfill order, send receipt
      console.log('Payment completed:', data?.id);
      break;

    case 'payment.failed':
      // Handle failed payment
      // TODO: Notify customer, retry logic
      console.log('Payment failed:', data?.id);
      break;

    default:
      console.log('Unhandled payment event type:', type);
  }
}

/**
 * Handle booking events
 */
async function handleBookingEvent(event: SquareWebhookEvent): Promise<void> {
  const { type, data } = event;

  console.log(`Processing booking event: ${type}`, {
    eventId: event.eventId,
    bookingId: data?.id,
  });

  switch (type) {
    case 'booking.created':
      // Handle new booking
      // TODO: Send confirmation email, update calendar, notify staff
      console.log('Booking created:', data?.id);
      break;

    case 'booking.updated':
      // Handle booking update (time change, status change, etc.)
      // TODO: Send update notification, sync with calendar
      console.log('Booking updated:', data?.id);
      break;

    case 'booking.cancelled':
      // Handle cancelled booking
      // TODO: Send cancellation notification, free up calendar slot
      console.log('Booking cancelled:', data?.id);
      break;

    default:
      console.log('Unhandled booking event type:', type);
  }
}

/**
 * Handle customer events
 */
async function handleCustomerEvent(event: SquareWebhookEvent): Promise<void> {
  const { type, data } = event;

  console.log(`Processing customer event: ${type}`, {
    eventId: event.eventId,
    customerId: data?.id,
  });

  switch (type) {
    case 'customer.created':
      // Handle new customer
      // TODO: Sync with CRM, send welcome email
      console.log('Customer created:', data?.id);
      break;

    case 'customer.updated':
      // Handle customer update
      // TODO: Sync updated information with database
      console.log('Customer updated:', data?.id);
      break;

    case 'customer.deleted':
      // Handle customer deletion
      // TODO: Archive customer data, comply with GDPR
      console.log('Customer deleted:', data?.id);
      break;

    default:
      console.log('Unhandled customer event type:', type);
  }
}

/**
 * Route all events to appropriate handlers
 */
async function processWebhookEvent(event: SquareWebhookEvent): Promise<void> {
  const eventType = event.type || '';

  try {
    if (eventType.startsWith('payment.')) {
      await handlePaymentEvent(event);
    } else if (eventType.startsWith('booking.')) {
      await handleBookingEvent(event);
    } else if (eventType.startsWith('customer.')) {
      await handleCustomerEvent(event);
    } else {
      console.log('Unhandled event type:', eventType);
    }
  } catch (error) {
    console.error(`Error processing webhook event ${event.eventId}:`, error);
    throw error;
  }
}

/**
 * POST handler for Square webhooks
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // Check if webhook signature key is configured
  if (!SIGNATURE_KEY) {
    console.error('Square webhook handler called but SQUARE_WEBHOOK_SIGNATURE_KEY not configured');
    return NextResponse.json(
      { error: 'Webhook handler not configured' },
      { status: 503 }
    );
  }

  try {
    // Get signature from headers
    const signature = req.headers.get('x-square-signature');
    if (!signature) {
      console.error('Missing webhook signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Get request body as text for signature verification
    const body = await req.text();
    const url = req.url;

    // Verify signature
    const isValid = verifySignature(body, signature, url);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse event
    const event: SquareWebhookEvent = JSON.parse(body);

    // Log webhook receipt
    console.log('Received Square webhook:', {
      type: event.type,
      eventId: event.eventId,
      merchantId: event.merchantId,
      locationId: event.locationId,
    });

    // Process event asynchronously
    // In production, consider using a queue (e.g., Bull, AWS SQS)
    processWebhookEvent(event).catch(error => {
      console.error('Error processing webhook event:', error);
    });

    // Return 200 immediately to acknowledge receipt
    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET handler for webhook verification (Square webhook setup)
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    message: 'Square webhook endpoint is active',
    configured: Boolean(SIGNATURE_KEY),
  });
}
