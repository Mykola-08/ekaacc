// ─── Booking Reminder Service ───────────────────────────────
// Queries upcoming bookings and dispatches reminder notifications
// via all enabled channels (email, telegram, in-app).
// Called from a cron endpoint.

import { db } from '@/lib/db';
import { dispatchNotification } from './dispatcher';

/**
 * Send reminders for bookings happening in the next `hoursAhead` hours
 * that haven't already been reminded.
 */
export async function sendUpcomingReminders(hoursAhead = 24): Promise<{
  sent: number;
  errors: number;
}> {
  let sentCount = 0;
  let errorCount = 0;

  const now = new Date();
  const cutoff = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

  // Find bookings in the reminder window that haven't been reminded yet
  const { rows: bookings } = await db.query(
    `SELECT b.id, b.client_id, b.starts_at, b.ends_at, b.email,
            b.display_name, s.name as service_name
     FROM bookings b
     JOIN service s ON b.service_id = s.id
     WHERE b.status IN ('scheduled', 'confirmed')
       AND b.payment_status IN ('captured', 'authorized')
       AND b.starts_at > $1
       AND b.starts_at <= $2
       AND b.reminded_at IS NULL
       AND b.client_id IS NOT NULL
     ORDER BY b.starts_at ASC`,
    [now.toISOString(), cutoff.toISOString()]
  );

  for (const booking of bookings) {
    try {
      const startFormatted = new Date(booking.starts_at).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      await dispatchNotification({
        userId: booking.client_id,
        type: 'booking_reminder',
        title: 'Upcoming Appointment',
        body: `Reminder: Your ${booking.service_name} appointment is on ${startFormatted}.`,
        referenceId: booking.id,
        buttons: {
          inline_keyboard: [[
            { text: '📅 View Details', url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/bookings/${booking.id}` },
          ]],
        },
        data: {
          serviceName: booking.service_name,
          startTime: booking.starts_at,
          displayName: booking.display_name,
        },
      });

      // Mark as reminded so we don't send again
      await db.query(
        'UPDATE bookings SET reminded_at = $1 WHERE id = $2',
        [now.toISOString(), booking.id]
      );

      sentCount++;
    } catch (err) {
      console.error(`[Reminders] Failed for booking ${booking.id}:`, err);
      errorCount++;
    }
  }

  return { sent: sentCount, errors: errorCount };
}
