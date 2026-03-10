// ─── Notification Event Handlers ────────────────────────────
// Registers handlers on the internal event bus to dispatch
// notifications through all channels (email, telegram, in-app).

import { onEvent } from '@/lib/events';
import { dispatchNotification } from './dispatcher';
import { getBookingById } from '@/server/booking/service';

/**
 * Call once at app startup to wire booking events → notifications.
 * Imported in instrumentation.ts or a server-side init module.
 */
export function registerNotificationHandlers() {
  onEvent('booking.confirmed', async (payload) => {
    if (!payload.bookingId) return;
    const booking = await resolveBooking(payload.bookingId);
    if (!booking || !booking.userId) return;

    const startFormatted = formatDateTime(booking.startTime);
    await dispatchNotification({
      userId: booking.userId,
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      body: `Your appointment for ${booking.serviceName} on ${startFormatted} has been confirmed.`,
      referenceId: payload.bookingId,
      buttons: {
        inline_keyboard: [[
          { text: '📅 View Booking', url: `${siteUrl()}/bookings/${payload.bookingId}` },
        ]],
      },
      data: {
        serviceName: booking.serviceName,
        startTime: booking.startTime,
      },
    });
  });

  onEvent('booking.created', async (payload) => {
    if (!payload.bookingId) return;
    const booking = await resolveBooking(payload.bookingId);
    if (!booking || !booking.userId) return;

    const startFormatted = formatDateTime(booking.startTime);
    await dispatchNotification({
      userId: booking.userId,
      type: 'booking_created',
      title: 'Booking Received',
      body: `Your appointment for ${booking.serviceName} on ${startFormatted} has been received. Complete payment to confirm.`,
      referenceId: payload.bookingId,
      data: {
        serviceName: booking.serviceName,
        startTime: booking.startTime,
      },
    });
  });

  onEvent('booking.cancelled', async (payload) => {
    if (!payload.bookingId) return;
    const booking = await resolveBooking(payload.bookingId);
    if (!booking || !booking.userId) return;

    const startFormatted = formatDateTime(booking.startTime);
    await dispatchNotification({
      userId: booking.userId,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      body: `Your appointment for ${booking.serviceName} on ${startFormatted} has been cancelled.`,
      referenceId: payload.bookingId,
      data: {
        serviceName: booking.serviceName,
        startTime: booking.startTime,
      },
    });
  });

  onEvent('booking.payment_failed', async (payload) => {
    if (!payload.bookingId) return;
    const booking = await resolveBooking(payload.bookingId);
    if (!booking || !booking.userId) return;

    await dispatchNotification({
      userId: booking.userId,
      type: 'payment_failed',
      title: 'Payment Failed',
      body: `Payment for your ${booking.serviceName} appointment could not be processed. Please try again.`,
      referenceId: payload.bookingId,
      buttons: {
        inline_keyboard: [[
          { text: '💳 Retry Payment', url: `${siteUrl()}/bookings/${payload.bookingId}` },
        ]],
      },
    });
  });

  onEvent('booking.completed', async (payload) => {
    if (!payload.bookingId) return;
    const booking = await resolveBooking(payload.bookingId);
    if (!booking || !booking.userId) return;

    await dispatchNotification({
      userId: booking.userId,
      type: 'session_notes',
      title: 'Session Complete',
      body: `Your ${booking.serviceName} session is complete. Session notes will be available soon.`,
      referenceId: payload.bookingId,
    });
  });

  onEvent('payment.captured', async (payload) => {
    if (!payload.bookingId) return;
    const booking = await resolveBooking(payload.bookingId);
    if (!booking || !booking.userId) return;

    await dispatchNotification({
      userId: booking.userId,
      type: 'payment_received',
      title: 'Payment Received',
      body: `Payment for your ${booking.serviceName} appointment has been received. Thank you!`,
      referenceId: payload.bookingId,
    });
  });
}

// ─── Helpers ────────────────────────────────────────────────

interface ResolvedBooking {
  userId: string;
  serviceName: string;
  startTime: string;
  email: string;
}

async function resolveBooking(bookingId: string): Promise<ResolvedBooking | null> {
  try {
    const result = await getBookingById(bookingId);
    if (!result.data) return null;
    const b = result.data;
    return {
      userId: b.client_id ?? b.customer_reference_id ?? '',
      serviceName: b.service?.name ?? 'your service',
      startTime: b.starts_at ?? b.start_time ?? '',
      email: b.email ?? '',
    };
  } catch {
    return null;
  }
}

function formatDateTime(iso: string): string {
  if (!iso) return 'your scheduled time';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ekabalance.com';
}
