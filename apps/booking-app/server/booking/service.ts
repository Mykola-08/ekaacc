import { db } from '@/lib/db';
import { v4 as uuid } from 'uuid';
import { signManageToken, hashToken } from '@/lib/bookingToken';
import { emitEvent } from '@/lib/events';


// Simple in-memory cache for frequently accessed data
const serviceCache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const cached = serviceCache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    serviceCache.delete(key);
    return null;
  }
  return cached.data as T;
}

function setCache<T>(key: string, data: T, ttl = CACHE_TTL): void {
  serviceCache.set(key, { data, expiry: Date.now() + ttl });
}

export function invalidateServiceCache(serviceId?: string): void {
  if (serviceId) {
    serviceCache.delete(`service:${serviceId}`);
  } else {
    // Clear all service-related cache
    for (const key of serviceCache.keys()) {
      if (key.startsWith('service')) serviceCache.delete(key);
    }
  }
}

export async function fetchService(serviceId: string) {
  // Check cache first
  const cacheKey = `service:${serviceId}`;
  const cached = getCached<{ data: unknown; error: null }>(cacheKey);
  if (cached) return cached;

  try {
    // Use a single query with JOIN for better performance
    // Updated to support lookup by UUID or Slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(serviceId);
    
    const { rows } = await db.query(
      `SELECT s.id, s.name, s.description, s.stripe_product_id, s.metadata, s.image_url, s.images, s.tags,
              sv.id as variant_id, sv.name as variant_name, sv.description as variant_description,
              sv.duration_min, sv.price_amount, sv.currency, sv.stripe_price_id, sv.features, sv.comparison_label
       FROM service s
       LEFT JOIN service_variant sv ON s.id = sv.service_id AND sv.active = true
       WHERE ${isUuid ? 's.id = $1' : 's.slug = $1'}
       AND s.active = true
       ORDER BY sv.price_amount ASC`,
      [serviceId]
    );
    
    if (rows.length === 0) {
      return { data: null, error: { message: 'Service not found', code: '404' } };
    }

    // Process joined results - first row has service data, all rows have variant data
    const serviceRow = rows[0];
    const variants = rows
      .filter(r => r.variant_id) // Only rows with variant data
      .map(v => ({
        id: v.variant_id,
        name: v.variant_name,
        description: v.variant_description,
        duration: v.duration_min,
        price: v.price_amount / 100, // Convert cents to main unit for UI
        currency: v.currency,
        stripe_price_id: v.stripe_price_id,
        features: v.features || [],
        comparison_label: v.comparison_label || null
      }));

    // Backfill top-level price/duration from first variant (lowest price)
    const defaultVariant = variants[0] || { price: 0, duration: 60 };

    const serviceData = {
      id: serviceRow.id,
      name: serviceRow.name,
      description: serviceRow.description,
      stripe_product_id: serviceRow.stripe_product_id,
      metadata: serviceRow.metadata,
      location: serviceRow.location,
      image_url: serviceRow.image_url,
      images: serviceRow.images,
      price: defaultVariant.price,
      duration: defaultVariant.duration,
      variants
    };

    // Cache the result
    const result = { data: serviceData, error: null as string | null };
    setCache(cacheKey, result);

    return result;
  } catch (error) {
    console.error('Error fetching service:', error);
    return { data: null as any, error };
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
        time: (new Date(row.start_time).toISOString().split('T')[1] || '').substring(0, 5),
        start_time: row.start_time,
        end_time: row.end_time
      };
    });

    return { data: mappedRows, error: null as string | null };
  } catch (error) {
    console.error('Error listing bookings:', error);
    return { data: [] as any[], error };
  }
}

export async function listServices() {
  // Check cache first
  const cacheKey = 'services:list';
  const cached = getCached<{ data: unknown[]; error: null }>(cacheKey);
  if (cached) return cached;

  try {
    const { rows } = await db.query(
      `SELECT 
        s.id, 
        s.name, 
        s.slug,
        s.description, 
        s.active, 
        s.created_at, 
        s.stripe_product_id, 
        s.metadata, 
        s.location, 
        s.image_url,
        COALESCE(MIN(sv.price_amount), 0) / 100 as price,
        COALESCE((ARRAY_AGG(sv.duration_min ORDER BY sv.price_amount ASC))[1], 0) as duration
       FROM service s
       LEFT JOIN service_variant sv ON s.id = sv.service_id AND sv.active = true
       WHERE s.active = true 
       GROUP BY s.id
       ORDER BY s.name`
    );
    
    interface ServiceRow {
      id: string;
      name: string;
      slug?: string | null;
      description: string | null;
      active: boolean;
      created_at: string;
      stripe_product_id: string | null;
      metadata: Record<string, unknown> | null;
      location: string | null;
      image_url: string | null;
      price: number;
      duration: number;
      version?: string | null;
    }
    
    const mappedData = (rows as unknown as ServiceRow[]).map((s) => ({
      ...s,
      is_active: s.active,
      location: s.location || null,
      image_url: s.image_url || null,
      version: s.version || null
    }));
    
    const result = { data: mappedData, error: null as string | null };
    setCache(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error listing services:', error);
    return { data: null as any, error };
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
      staff: null as any // We don't have staff table join yet
    };

    return { data: result, error: null as string | null };
  } catch (error) {
    console.error('Error getting booking:', error);
    return { data: null as any, error };
  }
}

// Database health and monitoring utilities
export async function getBookingStats() {
  try {
    const { rows } = await db.query('SELECT status, payment_status FROM booking');
    
    const stats = {
      total: rows.length,
       
      byStatus: rows.reduce((acc: Record<string, number>, b: any) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
      }, {}),
       
      byPaymentStatus: rows.reduce((acc: Record<string, number>, b: any) => {
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
      error: null as string | null
    };
  } catch (err) {
    return { 
      healthy: false, 
      error: String(err),
      timestamp: new Date().toISOString()
    };
  }
}

interface BookingAddon {
  addonId: string;
  name: string;
  priceCents: number;
}

interface CreateBookingParams {
  serviceId: string;
  serviceVariantId?: string;
  originApp?: string;
  userId?: string;
  startTime: string;
  email: string;
  phone?: string;
  displayName?: string;
  paymentMode: 'full' | 'deposit';
  depositCents?: number;
  addons?: BookingAddon[];
  staffId?: string;
  metadata?: Record<string, unknown>;
  customerTags?: string[];
  usePlanUsageId?: string;
}

export async function createBooking(params: CreateBookingParams) {
  try {
    const {
      serviceId,
      serviceVariantId,
      originApp = 'web',
      userId,
      startTime,
      email,
      phone,
      displayName,
      paymentMode,
      depositCents = 0,
      addons = [],
      staffId,
      metadata = {},
      customerTags = [],
      usePlanUsageId: inputPlanId,
    } = params;

    let usePlanUsageId = inputPlanId;

    // 1. Fetch service
    const { rows: serviceRows } = await db.query(
      'SELECT id, name, requires_identity_verification, min_trust_score FROM service WHERE id = $1',
      [serviceId]
    );
    if (serviceRows.length === 0) {
      return { error: 'Service not found', status: 404 };
    }
    const service = serviceRows[0];

    // RESTRICTION CHECK
    if (service.requires_identity_verification || (service.min_trust_score || 0) > 0) {
       // We must check the user's status.
       const { rows: scoreRows } = await db.query('SELECT calculate_trust_score($1) as score', [email]);
       const userScore = scoreRows[0]?.score || 50; // Default 50

       // Check Trust Score
       if ((service.min_trust_score || 0) > userScore) {
          return { error: 'Booking restricted: Trust score requirement not met.', status: 403 };
       }

       // Check Identity 
       if (service.requires_identity_verification) {
          if (!userId) {
             return { error: 'This service requires identity verification. Please log in.', status: 403 };
          }
       }
    }

    // 1b. Fetch Variant (if provided) or Default
    let finalDuration = 60; 
    let finalPriceCents = 0;
    let finalVariantId = serviceVariantId || null;

    if (serviceVariantId) {
       interface VariantRow {
         id: string;
         duration_min: number;
         price_amount: number;
       }
       const { rows: vRows } = await db.query<VariantRow>(
         'SELECT id, duration_min, price_amount FROM service_variant WHERE id = $1 AND service_id = $2',
         [serviceVariantId, serviceId]
       );
       if (vRows.length === 0) {
         return { error: 'Service variant not found', status: 404 };
       }
       const variant = vRows[0];
       finalDuration = variant.duration_min;
       finalPriceCents = variant.price_amount;
    } else {
       // Attempt to find a default variant (lowest price)
       interface DefaultVariantRow {
         id: string;
         duration_min: number;
         price_amount: number;
       }
       const { rows: defaultV } = await db.query<DefaultVariantRow>(
         'SELECT id, duration_min, price_amount FROM service_variant WHERE service_id = $1 ORDER BY price_amount ASC LIMIT 1', 
         [serviceId]
       );
       if (defaultV.length > 0) {
          const def = defaultV[0];
          finalVariantId = def.id; 
          finalDuration = def.duration_min;
          finalPriceCents = def.price_amount;
       } else {
          return { error: 'Service has no bookable variants', status: 400 };
       }
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      return { error: 'Invalid startTime', status: 400 };
    }
    const end = new Date(start.getTime() + finalDuration * 60000);

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
          const durationHours = finalDuration / 60;
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

    // Check Plan logic
    // Modification: Automatically check for available credits if not explicitly provided
    if (userId && !usePlanUsageId) {
        const { rows: autoPlanRows } = await db.query(
            `SELECT id FROM user_plan_usage 
             WHERE user_id = $1 
               AND status = 'active' 
               AND (credits_total - credits_used) > 0 
               AND (expires_at IS NULL OR expires_at > NOW())
             ORDER BY expires_at ASC NULLS LAST, created_at ASC 
             LIMIT 1`,
            [userId]
        );
        if (autoPlanRows.length > 0) {
            usePlanUsageId = autoPlanRows[0].id;
        }
    }

    let initialPaymentStatus = 'pending';
    if (usePlanUsageId) {
        if (!userId) return { error: 'User ID required for plan usage', status: 400 };

        // Verify Plan Validity
        const { rows: planRows } = await db.query(
            'SELECT credits_total, credits_used, user_id, status FROM user_plan_usage WHERE id = $1', 
            [usePlanUsageId]
        );
        if (planRows.length === 0) return { error: 'Plan not found', status: 404 };
        const plan = planRows[0];
        
        if (plan.user_id !== userId) return { error: 'Plan belongs to another user', status: 403 };
        if (plan.status !== 'active') return { error: 'Plan is not active', status: 400 };
        if ((plan.credits_total - plan.credits_used) < 1) return { error: 'Insufficient plan credits', status: 402 };
        
        initialPaymentStatus = 'captured';
    }

    // 4. Prepare booking
    const reservationTTLMinutes = 5;
    const reservationExpiresAt = new Date(Date.now() + reservationTTLMinutes * 60000);
    const id = uuid();
    const manageToken = await signManageToken(id, 'manage', reservationTTLMinutes * 60);
    const manageTokenHash = hashToken(manageToken);

    const addonsTotal = addons.reduce((sum: number, a: any) => sum + (a.priceCents || 0), 0);
    const totalCents = finalPriceCents + addonsTotal;

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
        id, service_id, service_variant_id, origin_app, customer_reference_id, staff_id, start_time, end_time, duration_minutes,
        base_price_cents, currency, email, phone, display_name,
        addons_json, payment_mode, deposit_cents, payment_status,
        status, cancellation_policy, reservation_expires_at, manage_token_hash,
        metadata, customer_tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)`,
      [
        id, service.id, finalVariantId, originApp, userId || null, finalStaffId, start.toISOString(), end.toISOString(), finalDuration,
        finalPriceCents, 'EUR', email, phone, displayName,
        JSON.stringify(addons), paymentMode, paymentMode === 'deposit' ? depositCents : 0, initialPaymentStatus,
        'scheduled', JSON.stringify(cancellationPolicy), reservationExpiresAt.toISOString(), manageTokenHash,
        metadata, customerTags
      ]
    );

    if (usePlanUsageId && initialPaymentStatus === 'captured') {
        try {
            await db.query('SELECT consume_plan_credit_for_booking($1, $2)', [id, usePlanUsageId]);
        } catch (err) {
             console.error('Failed to consume plan credit:', err);
             // Rollback booking
             await db.query("UPDATE booking SET status = 'canceled', payment_status = 'failed' WHERE id = $1", [id]);
             return { error: 'Failed to process plan credit deduction', status: 500 };
        }
    }

    await emitEvent('booking.created', { bookingId: id, serviceId: service.id, startTime, staffId: finalStaffId });

    return {
      data: {
        bookingId: id,
        manageToken,
        totalCents,
        basePriceCents: finalPriceCents,
        addonsTotalCents: addonsTotal,
        depositCents: paymentMode === 'deposit' ? depositCents : undefined,
        reservationExpiresAt: reservationExpiresAt.toISOString(),
        staffId: finalStaffId,
      },
      error: null as string | null
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Error creating booking:', error);
    return { error: errorMessage, status: 500 };
  }
}

export async function getServiceAvailability(serviceId: string, date: string, serviceVariantId?: string) {
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
    let durationMin = service.duration;

    if (serviceVariantId) {
       const { rows: vRows } = await db.query(
         'SELECT duration_min FROM service_variant WHERE id = $1 AND service_id = $2',
         [serviceVariantId, serviceId]
       );
       if (vRows.length > 0) {
         durationMin = vRows[0].duration_min;
       }
    }

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
    interface AvailabilitySlot {
      startTime: string;
      endTime: string;
      staffId: string;
    }
    const slots: AvailabilitySlot[] = [];
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
        interface BookingRow {
          id: string;
          start_time: string;
          end_time: string;
          staff_id: string;
          payment_status: string;
        }
        const overlapping = (bookings as BookingRow[]).some((b) => {
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
      error: null as string | null
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Error getting availability:', error);
    return { error: errorMessage, status: 500 };
  }
}

export async function updateBookingPaymentStatus(bookingId: string, status: 'captured' | 'failed', stripePaymentIntentId?: string) {
  try {
    const bookingStatus = status === 'captured' ? 'scheduled' : 'canceled'; 
    await db.query(
      `UPDATE booking 
       SET payment_status = $1, 
           status = $2,
           stripe_payment_intent = COALESCE($3, stripe_payment_intent),
           updated_at = NOW()
       WHERE id = $4`,
      [status, bookingStatus, stripePaymentIntentId, bookingId]
    );
    
    if (status === 'captured') {
        await emitEvent('booking.confirmed', { bookingId });
    } else {
        await emitEvent('booking.payment_failed', { bookingId });
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating booking payment status:', error);
    return { success: false, error: 'Database update failed' };
  }
}
