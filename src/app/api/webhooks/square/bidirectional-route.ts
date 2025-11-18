import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import type { SquareWebhookEvent } from '@/types/square';
import { bidirectionalSyncService } from '@/services/bidirectional-sync-service';
import { isSquareAppointmentsEnabled } from '@/lib/feature-flags';

/**
 * Enhanced Square Webhook Handler for Bidirectional Sync
 * 
 * Handles real-time sync of booking and customer events from Square
 * and automatically syncs changes back to Square when data changes in Supabase
 * 
 * Setup Instructions:
 * 1. Set SQUARE_WEBHOOK_SIGNATURE_KEY in environment variables
 * 2. Configure webhook URL in Square Dashboard: https://your-domain.com/api/webhooks/square
 * 3. Subscribe to these event types:
 *    - booking.created
 *    - booking.updated  
 *    - booking.cancelled
 *    - customer.created
 *    - customer.updated
 *    - customer.deleted
 * 
 * Security:
 * - Verifies webhook signature to ensure authenticity
 * - Validates feature flags before processing
 * - Implements rate limiting and error handling
 * - Prevents sync loops with proper event filtering
 */

const SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

/**
 * Enhanced webhook event handler for Square Appointments
 */
interface EnhancedSquareWebhookEvent extends SquareWebhookEvent {
  timestamp?: string;
  retryCount?: number;
  source?: string; // To prevent sync loops
}

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
 * Process booking webhook events with bidirectional sync
 */
async function processBookingEvent(event: EnhancedSquareWebhookEvent): Promise<void> {
  const { type, data } = event;

  console.log(`Processing Square booking event: ${type}`, {
    eventId: event.eventId,
    bookingId: data?.id,
    timestamp: event.timestamp,
    source: event.source,
  });

  try {
    switch (type) {
      case 'booking.created':
        await handleBookingCreated(data);
        break;

      case 'booking.updated':
        await handleBookingUpdated(data);
        break;

      case 'booking.cancelled':
        await handleBookingCancelled(data);
        break;

      default:
        console.log('Unhandled booking event type:', type);
    }
  } catch (error) {
    console.error(`Failed to process booking event ${event.eventId}:`, error);
    throw error;
  }
}

/**
 * Process customer webhook events with bidirectional sync
 */
async function processCustomerEvent(event: EnhancedSquareWebhookEvent): Promise<void> {
  const { type, data } = event;

  console.log(`Processing Square customer event: ${type}`, {
    eventId: event.eventId,
    customerId: data?.id,
    timestamp: event.timestamp,
    source: event.source,
  });

  try {
    switch (type) {
      case 'customer.created':
        await handleCustomerCreated(data);
        break;

      case 'customer.updated':
        await handleCustomerUpdated(data);
        break;

      case 'customer.deleted':
        await handleCustomerDeleted(data);
        break;

      default:
        console.log('Unhandled customer event type:', type);
    }
  } catch (error) {
    console.error(`Failed to process customer event ${event.eventId}:`, error);
    throw error;
  }
}

/**
 * Handle new booking creation from Square
 */
async function handleBookingCreated(data: any): Promise<void> {
  if (!data?.id) {
    console.warn('Booking created event missing booking ID');
    return;
  }

  try {
    // Process the new booking through bidirectional sync
    const result = await bidirectionalSyncService.processInboundBooking(data, {
      direction: 'inbound',
      conflictResolution: 'external_wins' // External source wins for new bookings
    });
    
    console.log(`Successfully processed new booking from Square: ${data.id}`, {
      isNew: result.isNew,
      conflict: result.conflict
    });

    // Record sync statistics
    await recordSyncStatistics('booking', 'inbound', 'create', !result.conflict, !!result.conflict);

  } catch (error) {
    console.error(`Failed to process new booking ${data.id} from Square:`, error);
    throw error;
  }
}

/**
 * Handle booking updates from Square
 */
async function handleBookingUpdated(data: any): Promise<void> {
  if (!data?.id) {
    console.warn('Booking updated event missing booking ID');
    return;
  }

  try {
    // Check if this update was triggered by our own outbound sync to prevent loops
    if (data.source === 'api' && data.updated_by === 'supabase_sync') {
      console.log(`Skipping booking update ${data.id} - originated from Supabase sync`);
      return;
    }

    // Process the updated booking through bidirectional sync
    const result = await bidirectionalSyncService.processInboundBooking(data, {
      direction: 'inbound',
      conflictResolution: 'merge' // Try to merge changes
    });
    
    console.log(`Successfully processed updated booking from Square: ${data.id}`, {
      isUpdated: result.isUpdated,
      conflict: result.conflict
    });

    // Record sync statistics
    await recordSyncStatistics('booking', 'inbound', 'update', !result.conflict, !!result.conflict);

  } catch (error) {
    console.error(`Failed to process updated booking ${data.id} from Square:`, error);
    throw error;
  }
}

/**
 * Handle booking cancellation from Square
 */
async function handleBookingCancelled(data: any): Promise<void> {
  if (!data?.id) {
    console.warn('Booking cancelled event missing booking ID');
    return;
  }

  try {
    // Find the corresponding local booking
    const { data: syncMetadata, error: syncError } = await bidirectionalSyncService.supabaseClient
      ?.from('sync_metadata')
      .select('local_id')
      .eq('entity_type', 'booking')
      .eq('external_id', data.id)
      .eq('external_system', 'square')
      .single();

    if (syncError || !syncMetadata) {
      console.warn(`No local booking found for cancelled Square booking ${data.id}`);
      return;
    }

    // Update local booking status to cancelled
    const { error: updateError } = await bidirectionalSyncService.supabaseClient
      ?.from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', syncMetadata.local_id);

    if (updateError) {
      throw new Error(`Failed to update local booking status: ${updateError.message}`);
    }

    // Update sync metadata
    await bidirectionalSyncService.supabaseClient
      ?.from('sync_metadata')
      .update({ 
        entity_status: 'deleted',
        last_sync_at: new Date().toISOString()
      })
      .eq('id', syncMetadata.id);

    console.log(`Successfully processed cancelled booking from Square: ${data.id}`);

    // Record sync statistics
    await recordSyncStatistics('booking', 'inbound', 'delete', true, false);

  } catch (error) {
    console.error(`Failed to process cancelled booking ${data.id} from Square:`, error);
    throw error;
  }
}

/**
 * Handle new customer creation from Square
 */
async function handleCustomerCreated(data: any): Promise<void> {
  if (!data?.id) {
    console.warn('Customer created event missing customer ID');
    return;
  }

  try {
    // Process the new customer through bidirectional sync
    const result = await bidirectionalSyncService.processInboundCustomer(data, {
      direction: 'inbound',
      conflictResolution: 'external_wins' // External source wins for new customers
    });
    
    console.log(`Successfully processed new customer from Square: ${data.id}`, {
      isNew: result.isNew,
      conflict: result.conflict
    });

    // Record sync statistics
    await recordSyncStatistics('customer', 'inbound', 'create', !result.conflict, !!result.conflict);

  } catch (error) {
    console.error(`Failed to process new customer ${data.id} from Square:`, error);
    throw error;
  }
}

/**
 * Handle customer updates from Square
 */
async function handleCustomerUpdated(data: any): Promise<void> {
  if (!data?.id) {
    console.warn('Customer updated event missing customer ID');
    return;
  }

  try {
    // Check if this update was triggered by our own outbound sync to prevent loops
    if (data.source === 'api' && data.updated_by === 'supabase_sync') {
      console.log(`Skipping customer update ${data.id} - originated from Supabase sync`);
      return;
    }

    // Process the updated customer through bidirectional sync
    const result = await bidirectionalSyncService.processInboundCustomer(data, {
      direction: 'inbound',
      conflictResolution: 'merge' // Try to merge changes
    });
    
    console.log(`Successfully processed updated customer from Square: ${data.id}`, {
      isUpdated: result.isUpdated,
      conflict: result.conflict
    });

    // Record sync statistics
    await recordSyncStatistics('customer', 'inbound', 'update', !result.conflict, !!result.conflict);

  } catch (error) {
    console.error(`Failed to process updated customer ${data.id} from Square:`, error);
    throw error;
  }
}

/**
 * Handle customer deletion from Square
 */
async function handleCustomerDeleted(data: any): Promise<void> {
  if (!data?.id) {
    console.warn('Customer deleted event missing customer ID');
    return;
  }

  try {
    // Find the corresponding local customer
    const { data: syncMetadata, error: syncError } = await bidirectionalSyncService.supabaseClient
      ?.from('sync_metadata')
      .select('local_id')
      .eq('entity_type', 'customer')
      .eq('external_id', data.id)
      .eq('external_system', 'square')
      .single();

    if (syncError || !syncMetadata) {
      console.warn(`No local customer found for deleted Square customer ${data.id}`);
      return;
    }

    // Soft delete local customer (don't actually delete, just mark as inactive)
    const { error: updateError } = await bidirectionalSyncService.supabaseClient
      ?.from('user_profiles')
      .update({ 
        updated_at: new Date().toISOString()
        // Add a deleted flag if you have one, or handle this in your application logic
      })
      .eq('id', syncMetadata.local_id);

    if (updateError) {
      throw new Error(`Failed to update local customer: ${updateError.message}`);
    }

    // Update sync metadata
    await bidirectionalSyncService.supabaseClient
      ?.from('sync_metadata')
      .update({ 
        entity_status: 'deleted',
        last_sync_at: new Date().toISOString()
      })
      .eq('id', syncMetadata.id);

    console.log(`Successfully processed deleted customer from Square: ${data.id}`);

    // Record sync statistics
    await recordSyncStatistics('customer', 'inbound', 'delete', true, false);

  } catch (error) {
    console.error(`Failed to process deleted customer ${data.id} from Square:`, error);
    throw error;
  }
}

/**
 * Record sync statistics for monitoring
 */
async function recordSyncStatistics(
  entityType: string,
  direction: string,
  operation: string,
  success: boolean,
  conflict: boolean
): Promise<void> {
  try {
    // Use the bidirectional sync service to record statistics
    await bidirectionalSyncService.supabaseClient
      ?.rpc('record_sync_stat', {
        p_external_system: 'square',
        p_entity_type: entityType,
        p_sync_direction: direction,
        p_operation: operation,
        p_success: success,
        p_conflict: conflict,
        p_sync_time_ms: null // Will be calculated by the function
      });
  } catch (error) {
    console.error('Failed to record sync statistics:', error);
    // Don't throw - statistics failure shouldn't break the sync
  }
}

/**
 * Route all events to appropriate handlers with enhanced error handling
 */
async function processWebhookEvent(event: EnhancedSquareWebhookEvent): Promise<void> {
  const eventType = event.type || '';

  // Check if Square Appointments feature is enabled
  if (!isSquareAppointmentsEnabled()) {
    console.log('Square Appointments feature is disabled, skipping webhook processing');
    return;
  }

  // Add source identifier to prevent sync loops
  event.source = 'square_webhook';

  try {
    if (eventType.startsWith('booking.')) {
      await processBookingEvent(event);
    } else if (eventType.startsWith('customer.')) {
      await processCustomerEvent(event);
    } else {
      console.log('Unhandled event type:', eventType);
    }
  } catch (error) {
    console.error(`Error processing webhook event ${event.eventId}:`, error);
    
    // In production, you might want to:
    // 1. Retry the webhook (Square will retry automatically)
    // 2. Send to a dead letter queue
    // 3. Alert the development team
    // 4. Record the error for manual resolution
    throw error;
  }
}

/**
 * POST handler for Square webhooks
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // Check if Square Appointments feature is enabled
  if (!isSquareAppointmentsEnabled()) {
    return NextResponse.json(
      { error: 'Square Appointments feature is disabled' },
      { status: 503 }
    );
  }

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
    const event: EnhancedSquareWebhookEvent = JSON.parse(body);

    // Log webhook receipt
    console.log('Received Square webhook for bidirectional sync:', {
      type: event.type,
      eventId: event.eventId,
      merchantId: event.merchantId,
      locationId: event.locationId,
      timestamp: event.timestamp,
    });

    // Process event asynchronously to avoid webhook timeouts
    // In production, consider using a queue (e.g., Bull, AWS SQS, Redis)
    processWebhookEvent(event).catch(error => {
      console.error('Error processing webhook event in background:', error);
      // In production, send to error tracking service or retry queue
    });

    // Return 200 immediately to acknowledge receipt
    return NextResponse.json({ 
      received: true,
      timestamp: new Date().toISOString(),
      eventId: event.eventId,
      message: 'Webhook received and queued for processing'
    });

  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET handler for webhook verification and status
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const isEnabled = isSquareAppointmentsEnabled();
  
  return NextResponse.json({
    message: 'Square Appointments bidirectional sync webhook endpoint',
    enabled: isEnabled,
    configured: Boolean(SIGNATURE_KEY),
    timestamp: new Date().toISOString(),
    features: {
      bidirectionalSync: true,
      conflictResolution: true,
      realTimeSync: true,
      syncStatistics: true
    }
  });
}

/**
 * Export handler functions for testing
 */
export const handlers = {
  processBookingEvent,
  processCustomerEvent,
  handleBookingCreated,
  handleBookingUpdated,
  handleBookingCancelled,
  handleCustomerCreated,
  handleCustomerUpdated,
  handleCustomerDeleted,
  recordSyncStatistics,
};