import { db } from '@/lib/db';

export async function getWallet(profileId: string) {
  try {
    const { rows } = await db.query(
      `SELECT * FROM wallets WHERE profile_id = $1`,
      [profileId]
    );
    if (rows.length === 0) return { balanceCents: 0, pointsBalance: 0 };
    return {
      balanceCents: rows[0].balance_cents,
      pointsBalance: rows[0].points_balance,
      currency: rows[0].currency
    };
  } catch (error) {
    console.error('Error fetching wallet', error);
    return { balanceCents: 0, pointsBalance: 0 };
  }
}

export async function getUpcomingBookings(profileId: string) {
  try {
    // Join with service to get name
    const { rows } = await db.query(
      `SELECT b.*, s.name as service_name 
       FROM booking b
       JOIN service s ON b.service_id = s.id
       WHERE b.profile_id = $1 
         AND b.start_time > NOW() 
         AND b.status IN ('scheduled', 'confirmed')
       ORDER BY b.start_time ASC
       LIMIT 1`,
      [profileId]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
        id: row.id,
        serviceId: row.service_id,
        serviceName: row.service_name,
        startTime: row.start_time.toISOString(), // Ensure dates are serializable
        endTime: row.end_time.toISOString(),
        status: row.status,
        services: {
            title: row.service_name
        }
    } as any;
  } catch (error) {
    console.error('Error fetching bookings', error);
    return null;
  }
}

export async function getBookingsHistory(profileId: string) {
  try {
    const { rows } = await db.query(
      `SELECT b.*, s.name as service_name 
       FROM booking b
       JOIN service s ON b.service_id = s.id
       WHERE b.profile_id = $1 
       ORDER BY b.start_time DESC`,
      [profileId]
    );

    return rows.map((row: any) => ({
        id: row.id,
        serviceId: row.service_id,
        serviceName: row.service_name,
        startTime: row.start_time.toISOString(),
        endTime: row.end_time.toISOString(),
        status: row.status,
        services: {
             title: row.service_name
        }
    }));
  } catch (error) {
    console.error('Error fetching booking history', error);
    return [];
  }
}

export async function getTherapistDailySchedule(profileId: string) {
    // Mock implementation for now as we don't have full staff-profile linkage yet in migration
    // assuming profile_id IS the staff_id for now or we just query all bookings for today
    try {
        const { rows } = await db.query(
          `SELECT b.*, s.name as service_name, p.full_name as client_name
           FROM booking b
           JOIN service s ON b.service_id = s.id
           LEFT JOIN profiles p ON b.profile_id = p.id
           WHERE b.start_time >= CURRENT_DATE 
             AND b.start_time < CURRENT_DATE + INTERVAL '1 day'
           ORDER BY b.start_time ASC`,
           []
        );
        return rows;
      } catch (error) {
        console.error('Error fetching schedule', error);
        return [];
      }
}

export async function cancelBooking(bookingId: string, userId: string) {
  try {
    // In a real app, check cancellation policy window (e.g. 24h)
    const { rows } = await db.query(
      `UPDATE booking 
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 AND profile_id = $2
       RETURNING id, status, payment_status, base_price_cents`,
      [bookingId, userId]
    );
    
    if (rows.length === 0) {
      throw new Error("Booking not found or not authorized");
    }

    const booking = rows[0];

    // TODO: Trigger Refund if payment_status === 'paid'
    // if (booking.payment_status === 'paid') { ... }

    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error('Error cancelling booking', error);
    return { success: false, error: 'Failed to cancel booking' };
  }
}

export async function getPendingVerifications(therapistId: string) {
  try {
     // Fetch payments where method='manual' and status='pending'
     // This assumes a 'payment_proofs' table or similar logic
     // For now, we mock or query booking directly
     const { rows } = await db.query(
       `SELECT b.id, b.start_time, s.name as service_name, p.full_name, b.base_price_cents
        FROM booking b
        JOIN service s ON b.service_id = s.id
        LEFT JOIN profiles p ON b.profile_id = p.id
        WHERE b.payment_status = 'pending' AND b.payment_mode = 'manual'
        ORDER BY b.created_at ASC`
     );
     return rows;
  } catch (error) {
     console.error('Error fetching verifications', error);
     return [];
  }
}

export async function verifyPayment(bookingId: string, approved: boolean) {
   try {
     const status = approved ? 'paid' : 'pending'; // In real app, rejection might mean 'failed'
     // If rejected, we might want to keep it pending or cancel
     const { rows } = await db.query(
        `UPDATE booking SET payment_status = $1 WHERE id = $2 RETURNING id`,
        [status, bookingId]
     );
     return { success: true };
   } catch (error) {
     return { success: false };
   }
}

