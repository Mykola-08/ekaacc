import { db } from '@/lib/db';

export async function getWallet(userId: string) {
  try {
    const { rows } = await db.query(`SELECT * FROM wallets WHERE user_id = $1`, [userId]);
    if (rows.length === 0) return { balanceCents: 0, pointsBalance: 0 };
    return {
      balanceCents: rows[0]!.balance_cents,
      pointsBalance: rows[0]!.points_balance,
      currency: rows[0]!.currency,
    };
  } catch (error) {
    console.error('Error fetching wallet', error);
    return { balanceCents: 0, pointsBalance: 0 };
  }
}

export async function getUpcomingBookings(userId: string) {
  try {
    const { rows } = await db.query(
      `SELECT b.*, s.name as service_name 
       FROM bookings b
       JOIN service s ON b.service_id = s.id
       WHERE b.client_id = $1 
         AND b.starts_at > NOW() 
         AND b.status IN ('scheduled', 'confirmed')
       ORDER BY b.starts_at ASC
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) return null;

    const row = rows[0]!;
    return {
      id: row.id,
      serviceId: row.service_id,
      serviceName: row.service_name,
      startTime: row.starts_at.toISOString(),
      endTime: row.ends_at.toISOString(),
      status: row.status,
      services: {
        title: row.service_name,
      },
    } as any;
  } catch (error) {
    console.error('Error fetching bookings', error);
    return null;
  }
}

export async function getBookingsHistory(userId: string) {
  try {
    const { rows } = await db.query(
      `SELECT b.*, s.name as service_name 
       FROM bookings b
       JOIN service s ON b.service_id = s.id
       WHERE b.client_id = $1 
       ORDER BY b.starts_at DESC`,
      [userId]
    );

    return rows.map((row: any) => ({
      id: row.id,
      serviceId: row.service_id,
      serviceName: row.service_name,
      startTime: row.starts_at.toISOString(),
      endTime: row.ends_at.toISOString(),
      status: row.status,
      services: {
        title: row.service_name,
      },
    }));
  } catch (error) {
    console.error('Error fetching booking history', error);
    return [];
  }
}

export async function getTherapistDailySchedule(userId: string) {
  try {
    // Assuming auth.users is accessible. If not, fallback to metadata stored in booking (if any)
    const { rows } = await db.query(
      `SELECT b.*, s.name as service_name, s.duration as service_duration, 
                  u.email, 
                  u.raw_user_meta_data->>'first_name' as first_name,
                  u.raw_user_meta_data->>'last_name' as last_name,
                  u.raw_user_meta_data->>'full_name' as client_name,
                  u.raw_user_meta_data->>'phone' as phone
           FROM bookings b
           JOIN service s ON b.service_id = s.id
           LEFT JOIN auth.users u ON b.client_id = u.id
           WHERE b.starts_at >= CURRENT_DATE 
             AND b.starts_at < CURRENT_DATE + INTERVAL '1 day'
           ORDER BY b.starts_at ASC`,
      []
    );

    return rows.map((row) => ({
      ...row,
      services: {
        title: row.service_name,
        duration: row.service_duration,
      },
      profiles: {
        first_name: row.first_name || '',
        last_name: row.last_name || '',
        email: row.email,
        phone: row.phone,
      },
    }));
  } catch (error) {
    console.error('Error fetching schedule', error);
    return [];
  }
}

export async function cancelBooking(bookingId: string, userId: string) {
  try {
    const { rows } = await db.query(
      `UPDATE bookings 
       SET status = 'cancelled'
       WHERE id = $1 AND client_id = $2
       RETURNING id, status, payment_status, base_price_cents`,
      [bookingId, userId]
    );

    if (rows.length === 0) {
      throw new Error('Booking not found or not authorized');
    }

    const booking = rows[0]!;
    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error('Error cancelling booking', error);
    return { success: false, error: 'Failed to cancel booking' };
  }
}

export async function getPendingVerifications(therapistId: string) {
  try {
    const { rows } = await db.query(
      `SELECT b.id, b.starts_at, s.name as service_name, 
              u.raw_user_meta_data->>'full_name' as full_name, 
              b.base_price_cents
        FROM bookings b
        JOIN service s ON b.service_id = s.id
        LEFT JOIN auth.users u ON b.client_id = u.id
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
      `UPDATE bookings SET payment_status = $1 WHERE id = $2 RETURNING id`,
      [status, bookingId]
    );
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
