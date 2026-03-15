import { db } from '@/lib/db';
import { v4 as uuid } from 'uuid';
import { signManageToken, hashToken } from '@/lib/bookingToken';
import { emitEvent } from '@/lib/events';
import { LoyaltyService } from '@/server/loyalty/service';
import { ReputationService, BookingPolicy } from '@/server/reputation/service';
import { createAdminClient } from '@/lib/supabase/admin';

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
    // Determine if serviceId is UUID or Slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      serviceId
    );

    const supabase = createAdminClient();
    const { data: services, error: dbError } = await supabase
      .from('service')
      .select(
        `
        id, name, description, stripe_product_id, metadata, image_url, images, tags, location,
        service_variant (
          id, name, description, duration_min, price_amount, currency, stripe_price_id, features, comparison_label, active
        )
      `
      )
      .eq('active', true)
      .eq(isUuid ? 'id' : 'slug', serviceId)
      .limit(1);

    if (dbError) throw dbError;

    if (!services || services.length === 0) {
      return { data: null, error: { message: 'Service not found', code: '404' } };
    }

    // Process joined results
    const serviceRow = services[0];

    // @ts-ignore - Supabase types might imply single object or array depending on relation type, assuming array for hasMany
    const variantsRaw = Array.isArray(serviceRow.service_variant) ? serviceRow.service_variant : [];

    const variants = variantsRaw
      // @ts-ignore
      .filter((v: any) => v.active === true)
      // @ts-ignore
      .sort((a: any, b: any) => a.price_amount - b.price_amount)
      .map((v: any) => ({
        id: v.id,
        name: v.name,
        description: v.description,
        duration: v.duration_min,
        price: v.price_amount / 100, // Convert cents to main unit for UI
        currency: v.currency,
        stripe_price_id: v.stripe_price_id,
        features: v.features || [],
        comparison_label: v.comparison_label || null,
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
      variants,
    };

    // Cache the result
    const result = { data: serviceData, error: null as string | null };
    setCache(cacheKey, result);

    return result;
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
      `SELECT id, starts_at, ends_at, duration_minutes, payment_status, staff_id
       FROM bookings
       WHERE service_id = $1
       AND (payment_status = 'pending' OR payment_status = 'captured' OR payment_status = 'authorized')
       AND starts_at >= $2 AND starts_at <= $3`,
      [serviceId, startDate, endDate]
    );

    // Map to expected format if needed, or return as is
    const mappedRows = rows.map((row) => {
      return {
        ...row,
        date: new Date(row.starts_at).toISOString().split('T')[0],
        time: (new Date(row.starts_at).toISOString().split('T')[1] || '').substring(0, 5),
        start_time: row.starts_at,
        end_time: row.ends_at,
      };
    });

    return { data: mappedRows, error: null as string | null };
  } catch (error) {
    console.error('Error listing bookings:', error);
    return { data: [], error };
  }
}

export async function listServices() {
  // Check cache first
  const cacheKey = 'services:list';
  const cached = getCached<{ data: unknown[]; error: null }>(cacheKey);
  if (cached) return cached;

  try {
    const supabase = createAdminClient();

    const { data: services, error } = await supabase
      .from('service')
      .select(
        `id, name, slug, description, active, created_at, category,
         stripe_product_id, metadata, location, image_url,
         service_variant(duration_min, price_amount, active, currency)`
      )
      .eq('active', true)
      .order('name');

    if (error) throw error;

    interface VariantRow {
      duration_min: number | null;
      price_amount: number | null;
      active: boolean;
      currency: string | null;
    }

    const mappedData = (services || []).map((s) => {
      const activeVariants = ((s.service_variant as VariantRow[]) || [])
        .filter((v) => v.active)
        .sort((a, b) => (a.price_amount || 0) - (b.price_amount || 0));

      const minPrice = activeVariants.length > 0 ? (activeVariants[0].price_amount || 0) / 100 : 0;
      const duration = activeVariants.length > 0 ? activeVariants[0].duration_min || 0 : 0;
      const currency = activeVariants.length > 0 ? activeVariants[0].currency || 'EUR' : 'EUR';

      return {
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        active: s.active,
        created_at: s.created_at,
        stripe_product_id: s.stripe_product_id,
        metadata: s.metadata,
        location: s.location || null,
        image_url: s.image_url || null,
        category: s.category || null,
        is_active: s.active,
        version: null as string | null,
        price: minPrice,
        duration,
        currency,
      };
    });

    const result = { data: mappedData, error: null as string | null };
    setCache(cacheKey, result);

    return result;
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
       FROM bookings a
       LEFT JOIN service s ON a.service_id = s.id
       WHERE a.id = $1`,
      [bookingId]
    );

    if (rows.length === 0) {
      return { data: null, error: { message: 'Booking not found', code: '404' } };
    }

    const booking = rows[0]!;

    // Transform to match expected structure
    const result = {
      ...booking,
      service: {
        name: booking.service_name,
        duration: booking.service_duration,
        price: booking.service_price,
        description: booking.service_description,
      },
      staff: null, // We don't have staff table join yet
    };

    return { data: result, error: null as string | null };
  } catch (error) {
    console.error('Error getting booking:', error);
    return { data: null, error };
  }
}

// Database health and monitoring utilities
export async function getBookingStats() {
  try {
    const { rows } = await db.query('SELECT status, payment_status FROM bookings');

    const stats = {
      total: rows.length,

      byStatus: (rows as any[]).reduce((acc: Record<string, number>, b: any) => {
        const status = b.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {}),

      byPaymentStatus: (rows as any[]).reduce((acc: Record<string, number>, b: any) => {
        const pStatus = b.payment_status || 'unknown';
        acc[pStatus] = (acc[pStatus] || 0) + 1;
        return acc;
      }, {}),
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
      error: null as string | null,
    };
  } catch (err) {
    return {
      healthy: false,
      error: String(err),
      timestamp: new Date().toISOString(),
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
  rewardId?: string;
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
      rewardId,
      depositCents = 0,
      addons = [],
      staffId,
    } = params;

    let finalDepositCents = depositCents;

    // 1. Fetch service
    const { rows: serviceRows } = await db.query(
      'SELECT id, name, requires_identity_verification, min_trust_score, location FROM service WHERE id = $1',
      [serviceId]
    );
    if (serviceRows.length === 0) {
      return { error: 'Service not found', status: 404 };
    }
    const service = serviceRows[0]!;

    // RESTRICTION CHECK
    if (service.requires_identity_verification || (service.min_trust_score || 0) > 0) {
      // We must check the user's status.
      const { rows: scoreRows } = await db.query('SELECT calculate_trust_score($1) as score', [
        email,
      ]);
      const userScore = scoreRows[0]?.score || 50; // Default 50

      // Check Trust Score
      if ((service.min_trust_score || 0) > userScore) {
        return { error: 'Booking restricted: Trust score requirement not met.', status: 403 };
      }

      // Check Identity
      if (service.requires_identity_verification) {
        if (!userId) {
          return {
            error: 'This service requires identity verification. Please log in.',
            status: 403,
          };
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
      const variant = vRows[0]!;
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
        const def = defaultV[0]!;
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
      `SELECT id, starts_at, ends_at, payment_status, staff_id
       FROM bookings
       WHERE (payment_status = 'pending' OR payment_status = 'captured' OR payment_status = 'authorized')
       AND starts_at < $1 AND ends_at > $2`,
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
          if (startHour >= s.start_hour && startHour + durationHours <= s.end_hour) {
            const staffOverlap = overlapping.some((b) => b.staff_id === s.staff_id);
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

    // --- REWARD REDEMPTION LOGIC ---
    if (rewardId) {
      if (!userId) {
        return { error: 'You must be logged in to redeem rewards.', status: 401 };
      }

      try {
        // Redeem the reward (deduct points)
        const loyalty = new LoyaltyService();
        const redemption = await loyalty.redeemReward(userId, rewardId);
        const rewardMeta = redemption.reward || {};
        let discountCents = 0;

        if (rewardMeta.discount_percent) {
          discountCents = Math.floor(finalPriceCents * (rewardMeta.discount_percent / 100));
        } else if (rewardMeta.discount_amount_cents) {
          discountCents = rewardMeta.discount_amount_cents;
        } else if (rewardMeta.category === 'session') {
          // Free session covers full price
          discountCents = finalPriceCents;
        }

        if (discountCents > 0) {
          finalPriceCents = Math.max(0, finalPriceCents - discountCents);
          finalDepositCents = Math.max(0, finalDepositCents - discountCents);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to redeem reward';
        console.error('[Booking] Reward redemption failed:', err);
        return { error: errorMessage, status: 400 };
      }
    }
    // --------------------------------

    // Check Plan logic (user_plan_usage table removed — plan credits disabled for now)
    // If plan credit system is re-enabled, add the table and restore this logic.
    const usePlanCredits = false;

    const initialPaymentStatus = 'pending';
    // Plan credit logic disabled — table does not exist
    // if (usePlanCredits) { initialPaymentStatus = 'captured'; }

    // --- REPUTATION POLICY CHECK ---
    let reputationPolicy: BookingPolicy = {
      canBook: true,
      requiredDepositPercent: 50,
      allowPayLater: false,
      rejectionReason: '',
    };
    // Only check reputation if not fully covered by reward
    if (true) {
      reputationPolicy = await ReputationService.getPolicyForService(email, finalPriceCents);
      if (!reputationPolicy.canBook) {
        return {
          error: reputationPolicy.rejectionReason || 'Booking declined based on account policy.',
          status: 403,
        };
      }
    }
    // -------------------------------

    // 4. Prepare booking
    const reservationTTLMinutes = 5;
    const reservationExpiresAt = new Date(Date.now() + reservationTTLMinutes * 60000);
    const id = uuid();
    const manageToken = await signManageToken(id, 'manage', reservationTTLMinutes * 60);
    const manageTokenHash = hashToken(manageToken);

    const addonsTotal = addons.reduce(
      (sum: number, a: BookingAddon) => sum + (a.priceCents || 0),
      0
    );
    const totalCents = finalPriceCents + addonsTotal;

    if (paymentMode === 'deposit' && !rewardId) {
      // 1. Check if trying to pay 0 without permission
      if (finalDepositCents <= 0 && !reputationPolicy.allowPayLater) {
        return { error: 'Deposit amount required for deposit mode', status: 400 };
      }

      // 2. Check Min Percentage
      if (reputationPolicy.requiredDepositPercent > 0) {
        const requiredAmount = Math.floor(
          totalCents * (reputationPolicy.requiredDepositPercent / 100)
        );
        // Allow small margin of error (e.g. 1 cent)
        if (finalDepositCents < requiredAmount - 1) {
          return {
            error: `Insufficient deposit. Your account requires a ${reputationPolicy.requiredDepositPercent}% deposit.`,
            status: 400,
          };
        }
      }
    }

    const cancellationPolicy = {
      deadlineOffsetHours: 24,
      refundPercent: 50,
      feeCents: 0,
    };

    // --- ZOOM INTEGRATION ---
    const meetingUrl: string | null = null;
    // ------------------------

    // 5. Insert booking
    await db.query(
      `INSERT INTO bookings (
        id, service_id, service_variant_id, origin_app, client_id, therapist_id, staff_id, starts_at, ends_at, duration_minutes,
        base_price_cents, currency, email, phone, display_name,
        addons_json, payment_mode, deposit_amount_cents, payment_status,
        status, cancellation_policy, hold_expires_at, manage_token_hash,
        meeting_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)`,
      [
        id,
        service.id,
        finalVariantId,
        originApp,
        userId || null,
        userId || null,
        finalStaffId,
        start.toISOString(),
        end.toISOString(),
        finalDuration,
        finalPriceCents,
        'EUR',
        email,
        phone,
        displayName,
        JSON.stringify(addons),
        paymentMode,
        paymentMode === 'deposit' ? finalDepositCents : 0,
        initialPaymentStatus,
        'scheduled',
        JSON.stringify(cancellationPolicy),
        reservationExpiresAt.toISOString(),
        manageTokenHash,
        meetingUrl,
      ]
    );

    // Plan credit consumption disabled (user_plan_usage table removed)

    await emitEvent('booking.created', {
      bookingId: id,
      serviceId: service.id,
      startTime,
      staffId: finalStaffId,
    });

    return {
      data: {
        bookingId: id,
        manageToken,
        totalCents,
        basePriceCents: finalPriceCents,
        addonsTotalCents: addonsTotal,
        depositCents: paymentMode === 'deposit' ? finalDepositCents : undefined,
        reservationExpiresAt: reservationExpiresAt.toISOString(),
        staffId: finalStaffId,
      },
      error: null as string | null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Error creating booking:', error);
    return { error: errorMessage, status: 500 };
  }
}

export async function getServiceAvailability(
  serviceId: string,
  date: string,
  serviceVariantId?: string
) {
  try {
    // 1. Fetch service
    const { rows: serviceRows } = await db.query(
      'SELECT id, duration, name FROM service WHERE id = $1',
      [serviceId]
    );
    if (serviceRows.length === 0) {
      return { error: 'Service not found', status: 404 };
    }
    const service = serviceRows[0]!;
    let durationMin = service.duration;

    if (serviceVariantId) {
      const { rows: vRows } = await db.query(
        'SELECT duration_min FROM service_variant WHERE id = $1 AND service_id = $2',
        [serviceVariantId, serviceId]
      );
      if (vRows.length > 0) {
        durationMin = vRows[0]!.duration_min;
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
      `SELECT id, starts_at, ends_at, staff_id, payment_status 
       FROM bookings 
       WHERE starts_at >= $1 AND ends_at < $2`,
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

        if (
          end.getHours() > sched.end_hour ||
          (end.getHours() === sched.end_hour && end.getMinutes() > 0)
        ) {
          break; // Exceeds shift
        }

        // Overlap check
        interface BookingRow {
          id: string;
          starts_at: string;
          ends_at: string;
          staff_id: string;
          payment_status: string;
        }
        const overlapping = (bookings as BookingRow[]).some((b) => {
          const bStart = new Date(b.starts_at);
          const bEnd = new Date(b.ends_at);
          return (
            b.staff_id === staffId &&
            bStart < end &&
            bEnd > start &&
            ['pending', 'authorized', 'captured'].includes(b.payment_status)
          );
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
      error: null as string | null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Error getting availability:', error);
    return { error: errorMessage, status: 500 };
  }
}

export async function updateBookingPaymentStatus(
  bookingId: string,
  status: 'captured' | 'failed',
  stripePaymentIntentId?: string
) {
  try {
    const bookingStatus = status === 'captured' ? 'scheduled' : 'canceled';
    await db.query(
      `UPDATE bookings 
       SET payment_status = $1, 
           status = $2,
           stripe_payment_intent_id = COALESCE($3, stripe_payment_intent_id)
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
