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
        startTime: row.start_time.toISOString(),
        endTime: row.end_time.toISOString(),
        status: row.status,
        // Map other necessary fields or cast as needed
    } as any;
  } catch (error) {
    console.error('Error fetching bookings', error);
    return null;
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
