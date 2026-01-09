import { db } from '@/lib/db';
import { v4 as uuid } from 'uuid';
import { signManageToken, hashToken } from '@/lib/bookingToken';
import { emitEvent } from '@/lib/events';

export async function fetchService(serviceId: string) {
  try {
    const { rows } = await db.query(
      'SELECT id, name, price, duration, description, stripe_product_id, stripe_price_id, metadata, location, image_url FROM service WHERE id = $1',
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
      `SELECT id, name, price, duration, description, active, created_at, stripe_product_id, stripe_price_id, metadata, location, image_url
       FROM service 
       WHERE active = true 
       ORDER BY name`
    );
    
    const mappedData = rows.map((s: any) => ({
      ...s,
      is_active: s.active,
      // Use DB values or falback
      location: s.location || null,
      image_url: s.image_url || null,
      version: s.version || null
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
    const { rows } = await db.query('SELECT status, payment_status FROM booking');
    
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
    await db.query('SELECT count(*) FROM service');
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

export async function createBooking(params: {
  serviceId: string;
  startTime: string;
  email: string;
  phone?: string;
  displayName?: string;
  paymentMode: 'full' | 'deposit';
  depositCents?: number;
  addons?: any[];
  staffId?: string;
}) {
  try {
    const {
      serviceId,
      startTime,
      email,
      phone,
      displayName,
      paymentMode,
      depositCents = 0,
      addons = [],
      staffId,
    } = params;

    // 1. Fetch service
    const { rows: serviceRows } = await db.query(
      'SELECT id, name, price, duration FROM service WHERE id = $1',
      [serviceId]
    );
    if (serviceRows.length === 0) {
      return { error: 'Service not found', status: 404 };
    }
    const service = serviceRows[0];

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      return { error: 'Invalid startTime', status: 400 };
    }
    const end = new Date(start.getTime() + service.duration * 60000);

    // 2. Check overlaps
    const { rows: overlapping } = await db.query(
      `SELECT id, start_time, end_time, payment_status, staff_id
       FROM booking
       WHERE (payment_status = 'pending' OR payment_status = 'captured' OR payment_status = 'authorized')
       AND start_time < $1 AND end_time > $2`,
      [end.toISOString(), start.toISOString()]
    );

    // 3. Auto-assign staff
    let finalStaffId = staffId || null;
    if (!finalStaffId) {
      const weekday = start.getDay();
      const startHour = start.getHours();
      
      const { rows: schedules } = await db.query(
        'SELECT staff_id, start_hour, end_hour, active FROM staff_schedule WHERE weekday = $1 AND active = true',
        [weekday]
      );

      if (schedules.length > 0) {
        for (const s of schedules) {
          const durationHours = service.duration / 60;
          if (startHour >= s.start_hour && (startHour + durationHours) <= s.end_hour) {
            const staffOverlap = overlapping.some(b => b.staff_id === s.staff_id);
            if (!staffOverlap) {
              finalStaffId = s.staff_id;
              break;
            }
          }
        }
      }
    }

    if (!finalStaffId) {
      return { error: 'No staff available for this slot', status: 409 };
    }

    // 4. Prepare booking
    const reservationTTLMinutes = 5;
    const reservationExpiresAt = new Date(Date.now() + reservationTTLMinutes * 60000);
    const id = uuid();
    const manageToken = await signManageToken(id, 'manage', reservationTTLMinutes * 60);
    const manageTokenHash = hashToken(manageToken);

    const basePriceCents = Math.round(service.price * 100);
    const addonsTotal = addons.reduce((sum: number, a: any) => sum + (a.priceCents || 0), 0);
    const totalCents = basePriceCents + addonsTotal;

    if (paymentMode === 'deposit' && depositCents <= 0) {
      return { error: 'Deposit amount required for deposit mode', status: 400 };
    }

    const cancellationPolicy = {
      deadlineOffsetHours: 24,
      refundPercent: 50,
      feeCents: 0,
    };

    // 5. Insert booking
    await db.query(
      `INSERT INTO booking (
        id, service_id, staff_id, start_time, end_time, duration_minutes,
        base_price_cents, currency, email, phone, display_name,
        addons_json, payment_mode, deposit_cents, payment_status,
        status, cancellation_policy, reservation_expires_at, manage_token_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        id, service.id, finalStaffId, start.toISOString(), end.toISOString(), service.duration,
        basePriceCents, 'EUR', email, phone, displayName,
        JSON.stringify(addons), paymentMode, paymentMode === 'deposit' ? depositCents : 0, 'pending',
        'scheduled', JSON.stringify(cancellationPolicy), reservationExpiresAt.toISOString(), manageTokenHash
      ]
    );

    await emitEvent('booking.created', { bookingId: id, serviceId: service.id, startTime, staffId: finalStaffId });

    return {
      data: {
        bookingId: id,
        manageToken,
        totalCents,
        basePriceCents,
        addonsTotalCents: addonsTotal,
        depositCents: paymentMode === 'deposit' ? depositCents : undefined,
        reservationExpiresAt: reservationExpiresAt.toISOString(),
        staffId: finalStaffId,
      },
      error: null
    };

  } catch (error: any) {
    console.error('Error creating booking:', error);
    return { error: error.message || 'Internal Server Error', status: 500 };
  }
}

export async function getServiceAvailability(serviceId: string, date: string) {
  try {
    // 1. Fetch service
    const { rows: serviceRows } = await db.query(
      'SELECT id, duration, name FROM service WHERE id = $1',
      [serviceId]
    );
    if (serviceRows.length === 0) {
      return { error: 'Service not found', status: 404 };
    }
    const service = serviceRows[0];
    const durationMin = service.duration;

    const weekday = new Date(date + 'T00:00:00').getDay();

    // 2. Fetch staff schedules
    const { rows: schedules } = await db.query(
      'SELECT staff_id, start_hour, end_hour, active FROM staff_schedule WHERE weekday = $1 AND active = true',
      [weekday]
    );

    // 3. Fetch existing bookings
    const dayStart = new Date(date + 'T00:00:00Z');
    const dayEnd = new Date(dayStart.getTime() + 86400000);
    
    const { rows: bookings } = await db.query(
      `SELECT id, start_time, end_time, staff_id, payment_status 
       FROM booking 
       WHERE start_time >= $1 AND end_time < $2`,
      [dayStart.toISOString(), dayEnd.toISOString()]
    );

    // 4. Calculate slots
    const slots: any[] = [];
    for (const sched of schedules) {
      const staffId = sched.staff_id;
      // Simple hourly slots for now, can be improved to minute-level
      for (let hour = sched.start_hour; hour < sched.end_hour; hour++) {
        const start = new Date(date + 'T00:00:00');
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start.getTime() + durationMin * 60000);
        
        if (end.getHours() > sched.end_hour || (end.getHours() === sched.end_hour && end.getMinutes() > 0)) {
          break; // Exceeds shift
        }

        // Overlap check
        const overlapping = bookings.some((b: any) => {
          const bStart = new Date(b.start_time);
          const bEnd = new Date(b.end_time);
          return b.staff_id === staffId && 
                 bStart < end && 
                 bEnd > start && 
                 ['pending', 'authorized', 'captured'].includes(b.payment_status);
        });

        if (!overlapping) {
          slots.push({ startTime: start.toISOString(), endTime: end.toISOString(), staffId });
        }
      }
    }

    return {
      data: {
        serviceId: service.id,
        date,
        slots,
        generatedAt: new Date().toISOString(),
        durationMinutes: durationMin,
      },
      error: null
    };

  } catch (error: any) {
    console.error('Error getting availability:', error);
    return { error: error.message || 'Internal Server Error', status: 500 };
  }
}
