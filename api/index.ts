import { Hono, Context, Next } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const app = new Hono();

// Simple auth middleware - checks for Authorization header
const authMiddleware = async (c: Context, next: Next) => {
  const auth = c.req.header('Authorization');
  if (!auth) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  return next();
};

// CORS middleware
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Supabase helper
const getSupabase = () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY; // Or SERVICE_ROLE_KEY if needed for admin tasks
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
  return createClient(supabaseUrl, supabaseKey);
};

// Helper to get user
function getAuthenticatedUser(c: Context) {
  return c.get('user');
}

// Initialize session types
async function initializeSessionTypes() {
  const supabase = getSupabase();
  const { count } = await supabase
    .from('session_types')
    .select('*', { count: 'exact', head: true });

  if (count === 0) {
    const sessionTypes = [
      {
        name: 'Massatge Bàsic (1h)',
        description:
          "Sessió de massatge terapèutic d'una hora per alleujar tensions quotidianes i millorar el benestar general",
        base_price_cents: 6000,
        features: [
          'Alleujar tensions musculars',
          'Millorar circulació',
          'Reduir estrès',
          'Relaxació profunda',
        ],
        category: 'Massatge',
        is_active: true,
      },
      {
        name: 'Massatge Complet (1,5h)',
        description:
          "Sessió completa d'una hora i mitja que combina tècniques diverses per un tractament integral del cos",
        base_price_cents: 8500,
        features: [
          'Tractament corporal complet',
          'Combinació de tècniques',
          'Alleujar contractures profundes',
          'Equilibri energètic',
        ],
        category: 'Massatge',
        is_active: true,
      },
      {
        name: 'Massatge Premium (2h)',
        description:
          "L'experiència més completa: dues hores de tractament personalitzat amb tècniques avançades",
        base_price_cents: 12000,
        features: [
          'Tractament personalitzat complet',
          'Tècniques avançades',
          'Atenció detallada',
          'Màxima relaxació',
        ],
        category: 'Massatge',
        is_active: true,
      },
      {
        name: 'Kinesiologia Barcelona (1h)',
        description:
          'Sessió de kinesiologia aplicada per equilibrar el cos i detectar desequilibris energètics',
        base_price_cents: 7000,
        features: [
          'Equilibri energètic global',
          'Detecció de desequilibris',
          "Reducció de l'estrès",
          'Millora de la postura',
        ],
        category: 'Equilibri',
        is_active: true,
      },
    ];

    await supabase.from('session_types').insert(sessionTypes);
  }
}

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.get('/api/session-types', async (c) => {
  try {
    await initializeSessionTypes();
    const supabase = getSupabase();
    const { data: sessionTypes, error } = await supabase
      .from('session_types')
      .select('id, name, description, base_price_cents, features, category, is_active')
      .eq('is_active', true);

    if (error) throw error;

    // Sort manually
    const sorted = sessionTypes.sort((a, b) => {
      const getScore = (name: string) => {
        if (name.includes('360')) return 1;
        if (name.includes('Kinesiologia')) return 2;
        if (name.includes('Massatge')) return 3;
        return 4;
      };
      return getScore(a.name) - getScore(b.name);
    });

    const formatted = sorted.map((type) => ({
      ...type,
      // features is already JSON/array in Supabase if defined as jsonb
      durations: [60, 90, 120],
    }));

    return c.json(formatted);
  } catch (error) {
    console.error('Error fetching session types:', error);
    return c.json({ error: 'Failed to fetch session types' }, 500);
  }
});

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
      const supabase = getSupabase();

      if (user?.id) {
        await supabase.from('user_assessments_improved').insert({
          user_id: user.id,
          assessment_data: data,
        });
      }

      const { data: sessionTypes } = await supabase
        .from('session_types')
        .select('*')
        .eq('is_active', true);

      interface SessionType {
        id: string;
        name: string;
        description?: string;
        duration_minutes?: number;
        price_cents?: number;
        is_active?: boolean;
        created_at?: string;
        [key: string]: unknown;
      }

      const recommendations: SessionType[] = [];

      if (!sessionTypes) return c.json({ recommendations: [] });

      if (
        data.discomfort_areas.includes('neck_shoulders') ||
        data.discomfort_areas.includes('back_lumbar') ||
        data.goals.includes('improve_posture') ||
        data.preferred_technique === 'feldenkrais'
      ) {
        const feldenkrais = sessionTypes.find((s) => s.name.includes('Feldenkrais'));
        if (feldenkrais) recommendations.push(feldenkrais);
      }

      if (
        data.goals.includes('relieve_pain') ||
        data.goals.includes('relax') ||
        data.preferred_technique === 'therapeutic_massage'
      ) {
        const massage = sessionTypes.find((s) => s.name.includes('Massatge'));
        if (massage) recommendations.push(massage);
      }

      if (
        data.goals.includes('reduce_anxiety') ||
        data.goals.includes('more_energy') ||
        data.stress_level > 7 ||
        data.preferred_technique === 'kinesiology'
      ) {
        const kinesiology = sessionTypes.find((s) => s.name.includes('Kinesiologia'));
        if (kinesiology) recommendations.push(kinesiology);
      }

      if (recommendations.length === 0 || data.preferred_technique === 'dont_know') {
        const combined = sessionTypes.find((s) => s.name.includes('Combinada'));
        if (combined) recommendations.push(combined);
      }

      const formatted = recommendations.map((rec) => ({
        ...rec,
        durations: [60, 90, 120],
      }));

      return c.json({ recommendations: formatted.slice(0, 3) });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return c.json({ error: 'Failed to get recommendations' }, 500);
    }
  }
);

app.get('/api/pricing/calculate', async (c) => {
  try {
    const serviceId = c.req.query('serviceId');
    const duration = parseInt(c.req.query('duration') || '60');
    const date = c.req.query('date');
    const time = c.req.query('time');
    const userId = c.req.query('userId');

    if (!serviceId || !date || !time) return c.json({ error: 'Missing required parameters' }, 400);

    const supabase = getSupabase();
    const { data: service } = await supabase
      .from('session_types')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (!service) return c.json({ error: 'Service not found' }, 404);

    let basePriceCents = Number(service.base_price_cents);
    basePriceCents = Math.round(basePriceCents * (duration / 60));

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isSaturday = dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;

    let finalPriceCents = basePriceCents;
    interface PriceModifier {
      type: string;
      label: string;
      amount_cents: number;
      percentage: number;
      icon: string;
    }
    const modifiers: PriceModifier[] = [];

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

    let isVip = false;
    if (userId) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_vip, vip_expires_at')
        .eq('user_id', userId)
        .single();
      if (profile?.is_vip) {
        if (profile.vip_expires_at) {
          if (new Date() <= new Date(profile.vip_expires_at)) isVip = true;
        } else {
          isVip = true;
        }
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

    // const startTime = new Date(`${date}T${time}`);
    // const oneHourBefore = new Date(startTime.getTime() - 60 * 60 * 1000).toTimeString().slice(0, 5);
    // const oneHourAfter = new Date(startTime.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5);

    // Simplified back-to-back check (placeholder)
    const hasBackToBack = false;

    const { count: bookedSlots } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('appointment_date', date)
      .not('status', 'in', '("cancelled","no_show")');

    const occupancyRate = (bookedSlots || 0) / 8;
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

    finalPriceCents = Math.max(finalPriceCents, Math.round(basePriceCents * 0.7));

    return c.json({
      base_price_cents: basePriceCents,
      duration_minutes: duration,
      weekend_multiplier: isWeekend ? (isSunday ? 1.2 : 1.1) : 1.0,
      vip_discount: isVip ? 0.05 : 0,
      back_to_back_discount: hasBackToBack ? 0.1 : 0,
      high_demand_surcharge: occupancyRate > 0.8 ? 0.15 : 0,
      last_slot_surcharge: time >= '18:00' && occupancyRate > 0.6 ? 0.1 : 0,
      final_price_cents: finalPriceCents,
      modifiers: modifiers,
    });
  } catch (error) {
    console.error('Error calculating pricing:', error);
    return c.json({ error: 'Failed to calculate pricing' }, 500);
  }
});

app.post(
  '/api/appointments',
  authMiddleware,
  zValidator(
    'json',
    z.object({
      service_id: z.string(), // Changed to string (UUID)
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
      const supabase = getSupabase();

      const { data: sessionType } = await supabase
        .from('session_types')
        .select('*')
        .eq('id', data.service_id)
        .single();
      if (!sessionType) return c.json({ error: 'Session type not found' }, 404);

      const startTime = new Date(`${data.appointment_date}T${data.start_time}`);
      const endTime = new Date(startTime.getTime() + data.duration_minutes * 60000);
      const endTimeString = endTime.toTimeString().slice(0, 5);

      let finalPrice = Number(sessionType.base_price_cents);
      finalPrice = Math.round(finalPrice * (data.duration_minutes / 60));

      if (data.subcategory) {
        const subcategoryPrices: { [key: string]: number } = {
          'Massatge Relaxant': 0,
          'Massatge Descontracturant': 500,
          'Massatge Esportiu': 800,
        };
        finalPrice += subcategoryPrices[data.subcategory] || 0;
      }

      const locationMap: { [key: string]: string } = {
        barcelona: 'Plaça Universitat, Barcelona',
        online: 'Sessió virtual',
        home: 'Al teu domicili',
      };

      let appointmentNotes = data.session_goals ? JSON.stringify(data.session_goals) : null;
      if (data.subcategory) {
        const notesObj = appointmentNotes ? JSON.parse(appointmentNotes) : {};
        notesObj.subcategory = data.subcategory;
        appointmentNotes = JSON.stringify(notesObj);
      }

      const { data: result, error } = await supabase
        .from('appointments')
        .insert({
          customer_id: user?.id,
          therapist_id: 'default-therapist',
          service_id: data.service_id,
          appointment_date: data.appointment_date,
          start_time: data.start_time,
          end_time: endTimeString,
          status: 'pending',
          location_type: data.location,
          location_address: locationMap[data.location] || data.location,
          price_cents: finalPrice,
          customer_notes: appointmentNotes,
        })
        .select()
        .single();

      if (error) throw error;

      return c.json({
        success: true,
        appointment_id: result.id,
        message: 'Appointment created successfully',
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      return c.json({ error: 'Failed to create appointment' }, 500);
    }
  }
);

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
      const supabase = getSupabase();

      await supabase.from('contact_submissions').insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        preferred_contact: data.preferred_contact || 'email',
        preferred_time: data.preferred_time,
      });

      return c.json({ success: true });
    } catch (error) {
      console.error('Error saving contact form:', error);
      return c.json({ error: 'Failed to save contact form' }, 500);
    }
  }
);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
