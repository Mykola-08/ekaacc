import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { addDashboardEndpoints } from './api-endpoints';

type Bindings = {
  DB: D1Database;
  OPENAI_API_KEY: string;
  PERPLEXITY_API_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

type Variables = {
  user?: {
    id: string;
    email?: string;
    [key: string]: any;
  };
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Simple auth middleware - checks for Authorization header
const authMiddleware = async (c: any, next: any) => {
  const auth = c.req.header('Authorization');
  if (!auth) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
};

// CORS middleware configuration
// Allows all origins for development flexibility, but should be restricted in production
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Helper function to get user from context (after auth middleware)
function getAuthenticatedUser(c: any) {
  return c.get('user');
}

// Initialize session types data
async function initializeSessionTypes(db: D1Database) {
  try {
    const count = await db.prepare('SELECT COUNT(*) as count FROM session_types').first();

    if (!count || count.count === 0) {
      const sessionTypes = [
        {
          name: 'Massatge Bàsic (1h)',
          description:
            "Sessió de massatge terapèutic d'una hora per alleujar tensions quotidianes i millorar el benestar general",
          base_price_cents: 6000,
          features: JSON.stringify([
            'Alleujar tensions musculars',
            'Millorar circulació',
            'Reduir estrès',
            'Relaxació profunda',
          ]),
          category: 'Massatge',
          is_active: 1,
        },
        {
          name: 'Massatge Complet (1,5h)',
          description:
            "Sessió completa d'una hora i mitja que combina tècniques diverses per un tractament integral del cos",
          base_price_cents: 8500,
          features: JSON.stringify([
            'Tractament corporal complet',
            'Combinació de tècniques',
            'Alleujar contractures profundes',
            'Equilibri energètic',
          ]),
          category: 'Massatge',
          is_active: 1,
        },
        {
          name: 'Massatge Premium (2h)',
          description:
            "L'experiència més completa: dues hores de tractament personalitzat amb tècniques avançades",
          base_price_cents: 12000,
          features: JSON.stringify([
            'Tractament personalitzat complet',
            'Tècniques avançades',
            'Atenció detallada',
            'Màxima relaxació',
          ]),
          category: 'Massatge',
          is_active: 1,
        },
        {
          name: 'Kinesiologia Barcelona (1h)',
          description:
            'Sessió de kinesiologia aplicada per equilibrar el cos i detectar desequilibris energètics',
          base_price_cents: 7000,
          features: JSON.stringify([
            'Equilibri energètic global',
            'Detecció de desequilibris',
            "Reducció de l'estrès",
            'Millora de la postura',
          ]),
          category: 'Equilibri',
          is_active: 1,
        },
      ];

      for (const sessionType of sessionTypes) {
        await db
          .prepare(
            `
          INSERT INTO session_types (name, description, base_price_cents, features, category, is_active, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `
          )
          .bind(
            sessionType.name,
            sessionType.description,
            sessionType.base_price_cents,
            sessionType.features,
            sessionType.category,
            sessionType.is_active
          )
          .run();
      }
    }
  } catch (error) {
    console.error('Error initializing session types:', error);
  }
}

// Authentication endpoints removed - using Supabase instead

// User profile endpoint moved to api-endpoints.ts

app.post('/api/health', async (c) => {
  return c.json({ success: true }, 200);
});

// Basic health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get session types
app.get('/api/session-types', async (c) => {
  try {
    await initializeSessionTypes(c.env.DB);

    const sessionTypes = await c.env.DB.prepare(
      `
      SELECT id, name, description, base_price_cents, features, category, is_active
      FROM session_types 
      WHERE is_active = 1
      ORDER BY 
        CASE 
          WHEN name LIKE '%360%' THEN 1
          WHEN name LIKE '%Kinesiologia%' THEN 2
          WHEN name LIKE '%Massatge%' THEN 3
          ELSE 4
        END
    `
    ).all();

    const formattedTypes = sessionTypes.results.map((type: any) => ({
      ...type,
      features: type.features ? JSON.parse(type.features) : [],
      durations: [60, 90, 120], // Default available durations
    }));

    return c.json(formattedTypes);
  } catch (error) {
    console.error('Error fetching session types:', error);
    return c.json({ error: 'Failed to fetch session types' }, 500);
  }
});

// Get recommendations based on user preferences
app.post(
  '/api/recommendations',
  authMiddleware,
  zValidator(
    'json',
    z.object({
      goals: z.array(z.string()),
      discomfort_areas: z.array(z.string()),
      preferred_technique: z.string(),
      work_style: z.string(),
      energy_level: z.number(),
      stress_level: z.number(),
    })
  ),
  async (c) => {
    try {
      const user = getAuthenticatedUser(c);

      const data = c.req.valid('json');

      // Save recommendation data for future reference
      await c.env.DB.prepare(
        `
      INSERT INTO user_assessments_improved (user_id, assessment_data, created_at, updated_at)
      VALUES (?, ?, datetime('now'), datetime('now'))
    `
      )
        .bind(user?.id || '', JSON.stringify(data))
        .run();

      // Simple recommendation logic
      const recommendations = [];

      // Use Supabase for unified services
      const supabaseUrl = c.env.SUPABASE_URL || 'https://placeholder.supabase.co';
      const supabaseKey = c.env.SUPABASE_ANON_KEY;

      let services: any[] = [];

      if (supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase
          .from('service')
          .select('*')
          .eq('is_public', true)
          .eq('active', true);

        if (!error && data) {
          services = data;
        } else {
          console.error('Error fetching services from Supabase:', error);
        }
      } else {
        console.warn('Supabase credentials missing, skipping Unified Service fetch');
      }

      // Fallback or empty if connection failed, but try to use what we found
      if (services.length > 0) {
        // Feldenkrais for movement and posture issues
        if (
          data.discomfort_areas.includes('neck_shoulders') ||
          data.discomfort_areas.includes('back_lumbar') ||
          data.goals.includes('improve_posture') ||
          data.preferred_technique === 'feldenkrais'
        ) {
          const feldenkrais = services.find((s: any) => s.name && s.name.includes('Feldenkrais'));
          if (feldenkrais) recommendations.push(feldenkrais);
        }

        // Massage for pain relief and relaxation
        if (
          data.goals.includes('relieve_pain') ||
          data.goals.includes('relax') ||
          data.preferred_technique === 'therapeutic_massage'
        ) {
          const massage = services.find((s: any) => s.name && s.name.includes('Massatge'));
          if (massage) recommendations.push(massage);
        }

        // Kinesiology for energy and stress
        if (
          data.goals.includes('reduce_anxiety') ||
          data.goals.includes('more_energy') ||
          data.stress_level > 7 ||
          data.preferred_technique === 'kinesiology'
        ) {
          const kinesiology = services.find((s: any) => s.name && s.name.includes('Kinesiologia'));
          if (kinesiology) recommendations.push(kinesiology);
        }

        // If no specific match or user doesn't know, recommend combined session
        if (recommendations.length === 0 || data.preferred_technique === 'dont_know') {
          const combined = services.find((s: any) => s.name && s.name.includes('Combinada'));
          if (combined) recommendations.push(combined);
        }
      } else {
        // Fallback to D1 if Supabase fails or returns nothing (legacy support during migration)
        const sessionTypes = await c.env.DB.prepare(
          `
          SELECT * FROM session_types WHERE is_active = 1
        `
        ).all();

        // Feldenkrais for movement and posture issues
        if (
          data.discomfort_areas.includes('neck_shoulders') ||
          data.discomfort_areas.includes('back_lumbar') ||
          data.goals.includes('improve_posture') ||
          data.preferred_technique === 'feldenkrais'
        ) {
          const feldenkrais = sessionTypes.results.find((s: any) => s.name.includes('Feldenkrais'));
          if (feldenkrais) recommendations.push(feldenkrais);
        }

        // Massage for pain relief and relaxation
        if (
          data.goals.includes('relieve_pain') ||
          data.goals.includes('relax') ||
          data.preferred_technique === 'therapeutic_massage'
        ) {
          const massage = sessionTypes.results.find((s: any) => s.name.includes('Massatge'));
          if (massage) recommendations.push(massage);
        }

        // Kinesiology for energy and stress
        if (
          data.goals.includes('reduce_anxiety') ||
          data.goals.includes('more_energy') ||
          data.stress_level > 7 ||
          data.preferred_technique === 'kinesiology'
        ) {
          const kinesiology = sessionTypes.results.find((s: any) =>
            s.name.includes('Kinesiologia')
          );
          if (kinesiology) recommendations.push(kinesiology);
        }

        // If no specific match or user doesn't know, recommend combined session
        if (recommendations.length === 0 || data.preferred_technique === 'dont_know') {
          const combined = sessionTypes.results.find((s: any) => s.name.includes('Combinada'));
          if (combined) recommendations.push(combined);
        }
      }

      // Format recommendations
      const formattedRecommendations = recommendations.map((rec: any) => ({
        ...rec,
        features: rec.metadata?.features // from Supabase jsonb
          ? rec.metadata.features
          : rec.features && typeof rec.features === 'string'
            ? JSON.parse(rec.features)
            : [], // Fallback for D1
        durations: [60, 90, 120],
      }));

      return c.json({ recommendations: formattedRecommendations.slice(0, 3) });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return c.json({ error: 'Failed to get recommendations' }, 500);
    }
  }
);

// Dynamic pricing calculation endpoint
app.get('/api/pricing/calculate', async (c) => {
  try {
    const serviceId = c.req.query('serviceId');
    const duration = parseInt(c.req.query('duration') || '60');
    const date = c.req.query('date');
    const time = c.req.query('time');
    const userId = c.req.query('userId');

    if (!serviceId || !date || !time) {
      return c.json({ error: 'Missing required parameters' }, 400);
    }

    // Get base service price
    const service = await c.env.DB.prepare(
      `
      SELECT * FROM session_types WHERE id = ?
    `
    )
      .bind(serviceId)
      .first();

    if (!service) {
      return c.json({ error: 'Service not found' }, 404);
    }

    let basePriceCents = Number(service.base_price_cents);

    // Adjust price based on duration (basic multiplier)
    const baseDuration = 60; // minutes
    basePriceCents = Math.round(basePriceCents * (duration / baseDuration));

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isSaturday = dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;

    let finalPriceCents = basePriceCents;
    const modifiers: any[] = [];

    // Weekend surcharges
    if (isSaturday) {
      const surcharge = Math.round(basePriceCents * 0.1);
      finalPriceCents += surcharge;
      modifiers.push({
        type: 'surcharge',
        label: 'Suplement dissabte',
        amount_cents: surcharge,
        percentage: 10,
        icon: 'weekend',
      });
    }

    if (isSunday) {
      const surcharge = Math.round(basePriceCents * 0.2);
      finalPriceCents += surcharge;
      modifiers.push({
        type: 'surcharge',
        label: 'Suplement diumenge',
        amount_cents: surcharge,
        percentage: 20,
        icon: 'weekend',
      });
    }

    // Check for VIP status
    let isVip = false;
    if (userId) {
      try {
        const profile = await c.env.DB.prepare(
          `
          SELECT is_vip, vip_expires_at FROM user_profiles WHERE user_id = ?
        `
        )
          .bind(userId)
          .first();

        if (profile && profile.is_vip) {
          // Check if VIP status has expired
          if (profile.vip_expires_at) {
            const expiryDate = new Date(String(profile.vip_expires_at));
            const now = new Date();
            if (now <= expiryDate) {
              isVip = true;
            }
          } else {
            isVip = true;
          }
        }
      } catch (error) {
        console.error('Error checking VIP status:', error);
        isVip = false;
      }

      if (isVip) {
        const discount = Math.round(basePriceCents * 0.05);
        finalPriceCents -= discount;
        modifiers.push({
          type: 'discount',
          label: 'Descompte VIP',
          amount_cents: -discount,
          percentage: 5,
          icon: 'vip',
        });
      }
    }

    // Check for back-to-back sessions (sessions within 1 hour before/after) - ANY CLIENT
    let hasBackToBack = false;
    const startTime = new Date(`${date}T${time}`);
    const oneHourBefore = new Date(startTime.getTime() - 60 * 60 * 1000);
    const oneHourAfter = new Date(startTime.getTime() + 60 * 60 * 1000);

    const backToBackCheck = await c.env.DB.prepare(
      `
      SELECT COUNT(*) as count FROM appointments 
      WHERE appointment_date = ?
      AND status NOT IN ('cancelled', 'no_show')
      AND (
        (start_time >= ? AND start_time <= ?) OR
        (end_time >= ? AND end_time <= ?)
      )
    `
    )
      .bind(
        date,
        oneHourBefore.toTimeString().slice(0, 5),
        oneHourAfter.toTimeString().slice(0, 5),
        oneHourBefore.toTimeString().slice(0, 5),
        oneHourAfter.toTimeString().slice(0, 5)
      )
      .first();

    if (backToBackCheck && Number(backToBackCheck.count) > 0) {
      hasBackToBack = true;
      const discount = Math.round(basePriceCents * 0.1);
      finalPriceCents -= discount;
      modifiers.push({
        type: 'discount',
        label: 'Descompte per optimització horària',
        amount_cents: -discount,
        percentage: 10,
        icon: 'back_to_back',
      });
    }

    // Check for high demand (>80% slots booked for that day)
    const totalSlotsForDay = 8; // Assuming 8 slots per day
    const bookedSlots = await c.env.DB.prepare(
      `
      SELECT COUNT(*) as count FROM appointments 
      WHERE appointment_date = ? 
      AND status NOT IN ('cancelled', 'no_show')
    `
    )
      .bind(date)
      .first();

    const occupancyRate = (Number(bookedSlots?.count) || 0) / totalSlotsForDay;
    if (occupancyRate > 0.8) {
      const surcharge = Math.round(basePriceCents * 0.15);
      finalPriceCents += surcharge;
      modifiers.push({
        type: 'surcharge',
        label: 'Alta demanda',
        amount_cents: surcharge,
        percentage: 15,
        icon: 'high_demand',
      });
    }

    // Check if it's the last available slot of the day (simplified logic)

    // If this is potentially the last slot (simplified logic)
    if (time >= '18:00' && occupancyRate > 0.6) {
      const surcharge = Math.round(basePriceCents * 0.1);
      finalPriceCents += surcharge;
      modifiers.push({
        type: 'surcharge',
        label: 'Última franja disponible',
        amount_cents: surcharge,
        percentage: 10,
        icon: 'last_slot',
      });
    }

    // Ensure minimum price
    finalPriceCents = Math.max(finalPriceCents, Math.round(basePriceCents * 0.7));

    const priceBreakdown = {
      base_price_cents: basePriceCents,
      duration_minutes: duration,
      weekend_multiplier: isWeekend ? (isSunday ? 1.2 : 1.1) : 1.0,
      vip_discount: isVip ? 0.05 : 0,
      back_to_back_discount: hasBackToBack ? 0.1 : 0,
      high_demand_surcharge: occupancyRate > 0.8 ? 0.15 : 0,
      last_slot_surcharge: time >= '18:00' && occupancyRate > 0.6 ? 0.1 : 0,
      final_price_cents: finalPriceCents,
      modifiers: modifiers,
    };

    return c.json(priceBreakdown);
  } catch (error) {
    console.error('Error calculating dynamic pricing:', error);
    return c.json({ error: 'Failed to calculate pricing' }, 500);
  }
});

// Get availability for a date and location
app.get('/api/availability', async (c) => {
  try {
    const date = c.req.query('date');
    const duration = parseInt(c.req.query('duration') || '60');
    const serviceId = c.req.query('serviceId');
    const userId = c.req.query('userId');

    if (!date) {
      return c.json({ error: 'Date is required' }, 400);
    }

    // Get base service price
    let basePriceCents = 6000; // default
    if (serviceId) {
      const service = await c.env.DB.prepare(
        `
        SELECT base_price_cents FROM session_types WHERE id = ?
      `
      )
        .bind(serviceId)
        .first();
      if (service) {
        basePriceCents = Number(service.base_price_cents);
      }
    }

    // Adjust for duration
    basePriceCents = Math.round(basePriceCents * (duration / 60));

    // Dynamic pricing for weekends
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isSaturday = dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;

    // Different schedules for weekdays vs weekends
    const weekdaySlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30', '20:00'];

    const weekendSlots = ['10:00', '11:30', '14:00', '15:30', '17:00', '18:30'];

    const availableSlots = isWeekend ? weekendSlots : weekdaySlots;

    // Check existing bookings for the day to determine demand
    const existingBookings = await c.env.DB.prepare(
      `
      SELECT COUNT(*) as count FROM appointments 
      WHERE appointment_date = ? AND status NOT IN ('cancelled', 'no_show')
    `
    )
      .bind(date)
      .first();

    const totalSlots = availableSlots.length;
    const bookedSlots = Number(existingBookings?.count) || 0;
    const occupancyRate = bookedSlots / totalSlots;

    // Check if user is VIP
    let isVip = false;
    if (userId) {
      try {
        const profile = await c.env.DB.prepare(
          `
          SELECT is_vip, vip_expires_at FROM user_profiles WHERE user_id = ?
        `
        )
          .bind(userId)
          .first();

        if (profile && profile.is_vip) {
          if (profile.vip_expires_at) {
            const expiryDate = new Date(String(profile.vip_expires_at));
            const now = new Date();
            if (now <= expiryDate) {
              isVip = true;
            }
          } else {
            isVip = true;
          }
        }
      } catch (error) {
        console.error('Error checking VIP status:', error);
      }
    }

    const slots = availableSlots.map((time) => {
      // Simulate some unavailable slots
      const isAvailable = Math.random() > 0.15; // 85% availability

      let priceCents = basePriceCents;
      let isHighDemand = false;
      let demandLabel = '';

      if (isAvailable) {
        // Dynamic weekend surcharge - Saturday 10%, Sunday 20%
        if (isSaturday) {
          priceCents += Math.round(basePriceCents * 0.1); // 10% surcharge for Saturday
        } else if (isSunday) {
          priceCents += Math.round(basePriceCents * 0.2); // 20% surcharge for Sunday
        }

        // High demand slots (evening hours or high occupancy)
        const hour = parseInt(time.split(':')[0] || '0');
        const isEveningSlot = hour >= 18;
        const isPopularSlot = occupancyRate > 0.6 && (isEveningSlot || Math.random() > 0.7);

        if (isPopularSlot) {
          isHighDemand = true;
          const surcharge = Math.round(basePriceCents * 0.15);
          priceCents += surcharge;
          demandLabel = isEveningSlot ? 'Franja popular' : 'Alta demanda';
        }

        // VIP discount
        if (isVip) {
          priceCents -= Math.round(basePriceCents * 0.05);
        }

        // Ensure minimum price
        priceCents = Math.max(priceCents, Math.round(basePriceCents * 0.7));
      }

      return {
        time,
        price_cents: priceCents,
        is_available: isAvailable,
        is_high_demand: isHighDemand,
        demand_label: demandLabel || undefined,
      };
    });

    return c.json(slots);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return c.json({ error: 'Failed to fetch availability' }, 500);
  }
});

// Create appointment
app.post(
  '/api/appointments',
  authMiddleware,
  zValidator(
    'json',
    z.object({
      service_id: z.number(),
      duration_minutes: z.number(),
      appointment_date: z.string(),
      start_time: z.string(),
      location: z.string(),
      subcategory: z.string().optional(),
      session_goals: z
        .object({
          primary_goals: z.array(z.string()),
          notes: z.string().optional(),
        })
        .optional(),
    })
  ),
  async (c) => {
    try {
      const user = getAuthenticatedUser(c);

      const data = c.req.valid('json');

      // Get session type details
      const sessionType = await c.env.DB.prepare(
        `
      SELECT * FROM session_types WHERE id = ?
    `
      )
        .bind(data.service_id)
        .first();

      if (!sessionType) {
        return c.json({ error: 'Session type not found' }, 404);
      }

      // Calculate end time
      const startTime = new Date(`${data.appointment_date}T${data.start_time}`);
      const endTime = new Date(startTime.getTime() + data.duration_minutes * 60000);
      const endTimeString = endTime.toTimeString().slice(0, 5);

      // Calculate final price with all modifiers
      let finalPrice = Number(sessionType.base_price_cents);

      // Adjust for duration
      finalPrice = Math.round(finalPrice * (data.duration_minutes / 60));

      // Add subcategory price modifier if applicable
      if (data.subcategory) {
        const subcategoryPrices: { [key: string]: number } = {
          'Massatge Relaxant': 0,
          'Massatge Descontracturant': 500,
          'Massatge Esportiu': 800,
        };
        finalPrice += subcategoryPrices[data.subcategory] || 0;
      }

      // Calculate location address
      const locationMap: { [key: string]: string } = {
        barcelona: 'Plaça Universitat, Barcelona',
        online: 'Sessió virtual',
        home: 'Al teu domicili',
      };

      // Prepare notes with subcategory info
      let appointmentNotes = data.session_goals ? JSON.stringify(data.session_goals) : null;
      if (data.subcategory) {
        const notesObj = appointmentNotes ? JSON.parse(appointmentNotes) : {};
        notesObj.subcategory = data.subcategory;
        appointmentNotes = JSON.stringify(notesObj);
      }

      // Create appointment
      const result = await c.env.DB.prepare(
        `
      INSERT INTO appointments (
        customer_id, therapist_id, service_id, appointment_date, start_time, end_time,
        status, location_type, location_address, price_cents, customer_notes,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `
      )
        .bind(
          user?.id || '',
          'default-therapist',
          data.service_id,
          data.appointment_date,
          data.start_time,
          endTimeString,
          'pending',
          data.location,
          locationMap[data.location] || data.location,
          finalPrice,
          appointmentNotes
        )
        .run();

      return c.json({
        success: true,
        appointment_id: result.meta.last_row_id,
        message: 'Appointment created successfully',
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      return c.json({ error: 'Failed to create appointment' }, 500);
    }
  }
);

// Get user appointments with role-based filtering
app.get('/api/appointments', authMiddleware, async (c) => {
  try {
    const user = getAuthenticatedUser(c);
    const role = c.req.query('role') || 'customer';

    let query = '';
    let params: any[] = [];

    if (role === 'customer') {
      query = `
        SELECT 
          a.*,
          st.name as service_name,
          st.description as service_description,
          st.category as service_category,
          up_therapist.first_name as therapist_first_name,
          up_therapist.last_name as therapist_last_name
        FROM appointments a
        JOIN session_types st ON a.service_id = st.id
        LEFT JOIN user_profiles up_therapist ON a.therapist_id = up_therapist.user_id
        WHERE a.customer_id = ?
        ORDER BY a.appointment_date DESC, a.start_time DESC
      `;
      params = [user?.id || ''];
    } else if (role === 'therapist') {
      query = `
        SELECT 
          a.*,
          st.name as service_name,
          st.description as service_description,
          st.category as service_category,
          up_customer.first_name as customer_first_name,
          up_customer.last_name as customer_last_name
        FROM appointments a
        JOIN session_types st ON a.service_id = st.id
        LEFT JOIN user_profiles up_customer ON a.customer_id = up_customer.user_id
        WHERE a.therapist_id = ?
        ORDER BY a.appointment_date ASC, a.start_time ASC
      `;
      params = [user?.id || ''];
    } else {
      // Admin - all appointments
      query = `
        SELECT 
          a.*,
          st.name as service_name,
          st.description as service_description,
          st.category as service_category,
          up_customer.first_name as customer_first_name,
          up_customer.last_name as customer_last_name,
          up_therapist.first_name as therapist_first_name,
          up_therapist.last_name as therapist_last_name
        FROM appointments a
        JOIN session_types st ON a.service_id = st.id
        LEFT JOIN user_profiles up_customer ON a.customer_id = up_customer.user_id
        LEFT JOIN user_profiles up_therapist ON a.therapist_id = up_therapist.user_id
        ORDER BY a.appointment_date DESC, a.start_time DESC
      `;
      params = [];
    }

    const appointments = await c.env.DB.prepare(query)
      .bind(...params)
      .all();

    const formattedAppointments = appointments.results.map((apt: any) => ({
      ...apt,
      customer_notes: apt.customer_notes ? JSON.parse(apt.customer_notes) : null,
    }));

    return c.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return c.json({ error: 'Failed to fetch appointments' }, 500);
  }
});


// Add dashboard endpoints
addDashboardEndpoints(app);

// Contact form endpoint
app.post(
  '/api/contact',
  zValidator(
    'json',
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      service: z.string().optional(),
      message: z.string().optional(),
      preferred_contact: z.string().optional(),
      preferred_time: z.string().optional(),
    })
  ),
  async (c) => {
    try {
      const data = c.req.valid('json');

      // Save contact form submission to database
      await c.env.DB.prepare(
        `
      INSERT INTO contact_submissions (
        name, email, phone, service, message, preferred_contact, preferred_time,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `
      )
        .bind(
          data.name,
          data.email,
          data.phone || null,
          data.service || null,
          data.message || null,
          data.preferred_contact || 'email',
          data.preferred_time || null
        )
        .run();

      return c.json({ success: true });
    } catch (error) {
      console.error('Error saving contact form:', error);
      return c.json({ error: 'Failed to save contact form' }, 500);
    }
  }
);

export default app;
