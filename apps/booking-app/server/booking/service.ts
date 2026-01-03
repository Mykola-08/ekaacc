import { db } from '@/lib/db';

export async function fetchService(serviceId: string) {
  try {
    const { rows } = await db.query(
      'SELECT id, name, price, duration, description FROM service WHERE id = $1',
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
    const startDate = startIso; // Assuming ISO strings are passed
    const endDate = endIso;

    const { rows } = await db.query(
      `SELECT id, start_time, end_time, duration_minutes as duration, payment_status, staff_id
       FROM booking
       WHERE service_id = $1
       AND (payment_status = 'pending' OR payment_status = 'captured' OR payment_status = 'authorized')
       AND start_time >= $2 AND start_time <= $3`,
      [serviceId, startDate, endDate]
    );

    // Map to expected format if needed, or return as is
    const mappedRows = rows.map(row => {
      return {
        ...row,
        date: new Date(row.start_time).toISOString().split('T')[0],
        time: new Date(row.start_time).toISOString().split('T')[1].substring(0, 5),
        start_time: row.start_time,
        end_time: row.end_time
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
      `SELECT id, name, price, duration, description, active, created_at 
       FROM service 
       WHERE active = true 
       ORDER BY name`
    );
    
    const mappedData = rows.map((s: any) => ({
      ...s,
      is_active: s.active,
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
       FROM booking a
       LEFT JOIN service s ON a.service_id = s.id
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
