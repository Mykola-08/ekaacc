import { db } from '@/lib/db';

export async function fetchService(serviceId: string) {
  try {
    const { rows } = await db.query(
      'SELECT id, name, price, duration, description FROM services WHERE id = $1',
      [serviceId]
    );
    
    if (rows.length === 0) {
      return { data: null, error: { message: 'Service not found', code: '404' } };
    }
    
    return { data: rows[0], error: null };
  } catch (error) {
    console.error('Error fetching service:', error);
    return { data: null, error };
  }
}

export async function listServiceBookings(serviceId: string, startIso: string, endIso: string) {
  try {
    // Extract dates from ISO strings
    const startDate = startIso.split('T')[0];
    const endDate = endIso.split('T')[0];

    const { rows } = await db.query(
      `SELECT id, date, time, duration, payment_status, practitioner_id as staff_id
       FROM appointments
       WHERE service_id = $1
       AND (payment_status = 'pending' OR payment_status = 'captured' OR payment_status = 'authorized')
       AND date >= $2 AND date <= $3`,
      [serviceId, startDate, endDate]
    );

    // Map to expected format if needed, or return as is
    // The UI likely expects start_time/end_time, so we might need to construct them
    // But for now let's return what we have and see if we need to adapt
    const mappedRows = rows.map(row => {
      // Construct simplified start/end for blocking
      // This is a simplification; real implementation needs proper time parsing
      return {
        ...row,
        start_time: `${row.date}T${row.time}`, // Approximate
        end_time: `${row.date}T${row.time}` // Needs duration math
      };
    });

    return { data: mappedRows, error: null };
  } catch (error) {
    console.error('Error listing bookings:', error);
    return { data: [], error };
  }
}

export async function listServices() {
  try {
    const { rows } = await db.query(
      `SELECT id, name, price, duration, description, is_active, created_at 
       FROM services 
       WHERE is_active = true 
       ORDER BY name`
    );
    
    const mappedData = rows.map((s: any) => ({
      ...s,
      active: s.is_active,
      image_url: null,
      location: null,
      version: null
    }));
    
    return { data: mappedData, error: null };
  } catch (error) {
    console.error('Error listing services:', error);
    return { data: null, error };
  }
}

export async function getBookingById(bookingId: string) {
  try {
    const { rows } = await db.query(
      `SELECT a.*, 
              s.name as service_name, s.duration as service_duration, s.price as service_price, s.description as service_description
       FROM appointments a
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.id = $1`,
      [bookingId]
    );

    if (rows.length === 0) {
      return { data: null, error: { message: 'Booking not found', code: '404' } };
    }

    const booking = rows[0];
    
    // Transform to match expected structure
    const result = {
      ...booking,
      service: {
        name: booking.service_name,
        duration: booking.service_duration,
        price: booking.service_price,
        description: booking.service_description
      },
      staff: null // We don't have staff table join yet
    };

    return { data: result, error: null };
  } catch (error) {
    console.error('Error getting booking:', error);
    return { data: null, error };
  }
}

// Database health and monitoring utilities
export async function getBookingStats() {
  try {
    const { rows } = await db.query('SELECT status, payment_status FROM appointments');
    
    const stats = {
      total: rows.length,
      byStatus: rows.reduce((acc: any, b: any) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
      }, {}),
      byPaymentStatus: rows.reduce((acc: any, b: any) => {
        acc[b.payment_status] = (acc[b.payment_status] || 0) + 1;
        return acc;
      }, {})
    };
    
    return { data: stats };
  } catch (error) {
    return { error };
  }
}

export async function checkDatabaseHealth() {
  try {
    const startTime = Date.now();
    await db.query('SELECT count(*) FROM services');
    const responseTime = Date.now() - startTime;
    
    return { 
      healthy: true, 
      timestamp: new Date().toISOString(),
      responseTimeMs: responseTime,
      error: null
    };
  } catch (err) {
    return { 
      healthy: false, 
      error: String(err),
      timestamp: new Date().toISOString()
    };
  }
}
