 
// Additional API endpoints for enhanced dashboard functionality
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
// import { uploadTestBlob } from './blob';

// Define bindings for environment variables and services
type Bindings = {
  DB: D1Database;
  OPENAI_API_KEY: string;
  PERPLEXITY_API_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
};

type Variables = {
  user?: {
    id: string;
    email?: string;
    [key: string]: any;
  };
};

// Simple auth middleware - checks for Authorization header
const authMiddleware = async (c: any, next: any) => {
  const auth = c.req.header('Authorization');
  if (!auth) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
};

export function addDashboardEndpoints(app: Hono<{ Bindings: Bindings; Variables: Variables }>) {
  
  /*
  // Test Blob Upload Endpoint
  // Used to verify Vercel Blob configuration
  app.post('/api/test-blob', async (c) => {
    const result = await uploadTestBlob(c.env.BLOB_READ_WRITE_TOKEN);
    return c.json(result);
  });
  */

  // Get user profile with enhanced data
  // Fetches user data from the users service and combines it with local profile data
  app.get('/api/users/me', authMiddleware, async (c) => {
    const user = c.get('user');
    
    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }
    
    try {
      const profile = await c.env.DB.prepare(`
        SELECT * FROM user_profiles WHERE user_id = ?
      `).bind(user.id).first();

      return c.json({
        ...user,
        profile: profile || null
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return c.json({ 
        ...user,
        profile: null
      });
    }
  });
  
  // Get user profile
  app.get('/api/users/me', authMiddleware, async (c) => {
    const user = c.get('user');
    
    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }
    
    try {
      const profile = await c.env.DB.prepare(`
        SELECT * FROM user_profiles WHERE user_id = ?
      `).bind(user.id).first();

      return c.json({
        ...user,
        profile: profile || null
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return c.json({ error: 'Failed to fetch profile' }, 500);
    }
  });

  // Update/Create user profile
  app.post('/api/profile', authMiddleware, zValidator('json', z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone: z.string().optional(),
    date_of_birth: z.string().optional(),
    emergency_contact_name: z.string().optional(),
    emergency_contact_phone: z.string().optional(),
    medical_conditions: z.string().optional(),
    allergies: z.string().optional(),
    preferences: z.string().optional(),
  })), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');

    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    try {
      // Check if profile exists
      const existingProfile = await c.env.DB.prepare(`
        SELECT id FROM user_profiles WHERE user_id = ?
      `).bind(user.id).first();

      if (existingProfile) {
        // Update existing profile
        await c.env.DB.prepare(`
          UPDATE user_profiles SET 
            first_name = ?, last_name = ?, phone = ?, date_of_birth = ?,
            emergency_contact_name = ?, emergency_contact_phone = ?,
            medical_conditions = ?, allergies = ?, preferences = ?,
            updated_at = datetime('now')
          WHERE user_id = ?
        `).bind(
          data.first_name, data.last_name, data.phone, data.date_of_birth,
          data.emergency_contact_name, data.emergency_contact_phone,
          data.medical_conditions, data.allergies, data.preferences,
          user.id
        ).run();
      } else {
        // Create new profile
        await c.env.DB.prepare(`
          INSERT INTO user_profiles (
            user_id, first_name, last_name, phone, date_of_birth,
            emergency_contact_name, emergency_contact_phone,
            medical_conditions, allergies, preferences,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `).bind(
          user.id, data.first_name, data.last_name, data.phone, data.date_of_birth,
          data.emergency_contact_name, data.emergency_contact_phone,
          data.medical_conditions, data.allergies, data.preferences
        ).run();
      }

      return c.json({ success: true });
    } catch (error) {
      console.error('Error saving profile:', error);
      return c.json({ error: 'Failed to save profile' }, 500);
    }
  });

  // Get/Set emotional state
  app.get('/api/emotional-state', authMiddleware, async (c) => {
    const user = c.get('user');
    
    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const result = await c.env.DB.prepare(`
        SELECT level, created_at FROM emotional_states 
        WHERE user_id = ? AND DATE(created_at) = ? 
        ORDER BY created_at DESC LIMIT 1
      `).bind(user.id, today).first();

      if (result) {
        return c.json({ 
          level: result.level, 
          timestamp: result.created_at 
        });
      } else {
        return c.json(null);
      }
    } catch (error) {
      console.error('Error fetching emotional state:', error);
      return c.json({ error: 'Failed to fetch emotional state' }, 500);
    }
  });

  app.post('/api/emotional-state', authMiddleware, zValidator('json', z.object({
    level: z.number().int().min(1).max(10)
  })), async (c) => {
    const user = c.get('user');
    const { level } = c.req.valid('json');

    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    try {
      await c.env.DB.prepare(`
        INSERT INTO emotional_states (user_id, level, created_at, updated_at)
        VALUES (?, ?, datetime('now'), datetime('now'))
      `).bind(user.id, level).run();

      return c.json({ success: true });
    } catch (error) {
      console.error('Error saving emotional state:', error);
      return c.json({ error: 'Failed to save emotional state' }, 500);
    }
  });

  // Get user promotions
  app.get('/api/promotions/user', authMiddleware, async (c) => {
    const user = c.get('user');
    
    if (!user?.id) {
      return c.json({ promotions: [], total_savings: 0 });
    }
    
    try {
      const promotions = await c.env.DB.prepare(`
        SELECT * FROM promotions 
        WHERE (target_user_id = ? OR target_user_id IS NULL) 
        AND is_active = 1 
        AND expires_at > datetime('now')
        ORDER BY created_at DESC
      `).bind(user.id).all();

      // Calculate total savings (mock for now)
      const totalSavings = 4200; // Example value in cents

      return c.json({
        promotions: promotions.results || [],
        total_savings: totalSavings
      });
    } catch (error) {
      console.error('Error fetching promotions:', error);
      return c.json({ 
        promotions: [], 
        total_savings: 0 
      });
    }
  });

  // Admin endpoints with enhanced stats
  app.get('/api/admin/stats', authMiddleware, async (c) => {
    const user = c.get('user');
    
    try {
      // Check if user is admin
      const profile = await c.env.DB.prepare(`
        SELECT is_admin FROM user_profiles WHERE user_id = ?
      `).bind(user?.id || '').first();
      
      if (!profile?.is_admin) {
        return c.json({ error: 'Unauthorized' }, 403);
      }

      // Get admin stats
      const adminStats = await c.env.DB.prepare(`
        SELECT * FROM admin_stats ORDER BY last_updated DESC LIMIT 1
      `).first();

      const revenueByMonth = await c.env.DB.prepare(`
        SELECT * FROM revenue_by_month ORDER BY id
      `).all();

      const topServices = await c.env.DB.prepare(`
        SELECT * FROM top_services_stats ORDER BY count DESC
      `).all();

      const customersByLocation = await c.env.DB.prepare(`
        SELECT * FROM customers_by_location ORDER BY count DESC
      `).all();

      return c.json({
        totalRevenue: adminStats?.total_revenue || 0,
        totalAppointments: adminStats?.total_appointments || 0,
        totalCustomers: adminStats?.total_customers || 0,
        pendingAppointments: adminStats?.pending_appointments || 0,
        monthlyGrowth: adminStats?.monthly_growth || 0,
        revenueByMonth: revenueByMonth.results || [],
        topServices: topServices.results || [],
        customersByLocation: customersByLocation.results || []
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return c.json({ error: 'Failed to fetch admin stats' }, 500);
    }
  });

  // Get admin users list
  app.get('/api/admin/users', authMiddleware, async (c) => {
    const user = c.get('user');
    
    try {
      // Check if user is admin
      const profile = await c.env.DB.prepare(`
        SELECT is_admin FROM user_profiles WHERE user_id = ?
      `).bind(user?.id || '').first();
      
      if (!profile?.is_admin) {
        return c.json({ error: 'Unauthorized' }, 403);
      }

      // Get all users with their profiles and appointment stats
      const users = await c.env.DB.prepare(`
        SELECT 
          up.user_id as id,
          up.first_name,
          up.last_name,
          up.role,
          up.is_active,
          COALESCE(appointment_stats.total_spent, 0) as total_spent,
          COALESCE(appointment_stats.appointment_count, 0) as appointment_count,
          appointment_stats.last_appointment,
          up.created_at
        FROM user_profiles up
        LEFT JOIN (
          SELECT 
            customer_id,
            SUM(price_cents) as total_spent,
            COUNT(*) as appointment_count,
            MAX(appointment_date) as last_appointment
          FROM appointments 
          WHERE status = 'completed'
          GROUP BY customer_id
        ) appointment_stats ON up.user_id = appointment_stats.customer_id
        ORDER BY up.created_at DESC
      `).all();

      // Mock email addresses for demo
      const usersWithEmails = users.results.map((u: any, index: number) => ({
        ...u,
        email: u.first_name ? `${u.first_name.toLowerCase()}@example.com` : `user${index + 1}@example.com`
      }));

      return c.json(usersWithEmails);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return c.json([]);
    }
  });

  // Get admin services with analytics
  app.get('/api/admin/services', authMiddleware, async (c) => {
    const user = c.get('user');
    
    try {
      // Check if user is admin
      const profile = await c.env.DB.prepare(`
        SELECT is_admin FROM user_profiles WHERE user_id = ?
      `).bind(user?.id).first();
      
      if (!profile?.is_admin) {
        return c.json({ error: 'Unauthorized' }, 403);
      }

      // Get services with booking analytics
      const services = await c.env.DB.prepare(`
        SELECT 
          st.*,
          COALESCE(service_stats.booking_count, 0) as booking_count,
          COALESCE(service_stats.total_revenue, 0) as total_revenue
        FROM session_types st
        LEFT JOIN (
          SELECT 
            service_id,
            COUNT(*) as booking_count,
            SUM(price_cents) as total_revenue
          FROM appointments 
          WHERE status = 'completed'
          GROUP BY service_id
        ) service_stats ON st.id = service_stats.service_id
        ORDER BY st.name
      `).all();

      return c.json(services.results || []);
    } catch (error) {
      console.error('Error fetching admin services:', error);
      return c.json([]);
    }
  });

  // Get pricing rules
  app.get('/api/admin/pricing-rules', authMiddleware, async (c) => {
    const user = c.get('user');
    
    try {
      // Check if user is admin
      const profile = await c.env.DB.prepare(`
        SELECT is_admin FROM user_profiles WHERE user_id = ?
      `).bind(user?.id).first();
      
      if (!profile?.is_admin) {
        return c.json({ error: 'Unauthorized' }, 403);
      }

      const rules = await c.env.DB.prepare(`
        SELECT * FROM pricing_rules ORDER BY created_at DESC
      `).all();

      return c.json(rules.results || []);
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
      return c.json([]);
    }
  });

  // Enhanced dashboard stats
  app.get('/api/dashboard/stats', authMiddleware, async (c) => {
    const user = c.get('user');
    
    try {
      // Get user role
      const profile = await c.env.DB.prepare(`
        SELECT role, is_admin, is_therapist FROM user_profiles WHERE user_id = ?
      `).bind(user?.id || '').first();
      
      let role: string = 'customer';
      if (profile?.is_admin) {
        role = 'admin';
      } else if (profile?.is_therapist) {
        role = 'therapist';
      } else {
        role = String(profile?.role || 'customer');
      }

      let stats: any = {};

      if (role === 'customer') {
        // Customer stats
        const appointmentCount = await c.env.DB.prepare(`
          SELECT COUNT(*) as total FROM appointments WHERE customer_id = ?
        `).bind(user?.id || '').first();

        const upcomingCount = await c.env.DB.prepare(`
          SELECT COUNT(*) as count FROM appointments 
          WHERE customer_id = ? AND appointment_date >= date('now') AND status NOT IN ('cancelled', 'no_show')
        `).bind(user?.id || '').first();

        const lastAppointment = await c.env.DB.prepare(`
          SELECT appointment_date FROM appointments 
          WHERE customer_id = ? AND status = 'completed'
          ORDER BY appointment_date DESC LIMIT 1
        `).bind(user?.id || '').first();

        stats = {
          totalAppointments: appointmentCount?.total || 0,
          upcomingAppointments: upcomingCount?.count || 0,
          lastAppointment: lastAppointment?.appointment_date || null,
        };
      } else if (role === 'therapist') {
        // Therapist stats
        const today = new Date().toISOString().split('T')[0];
        
        const todayCount = await c.env.DB.prepare(`
          SELECT COUNT(*) as count FROM appointments 
          WHERE therapist_id = ? AND appointment_date = ?
        `).bind(user?.id || '', today).first();

        const upcomingCount = await c.env.DB.prepare(`
          SELECT COUNT(*) as count FROM appointments 
          WHERE therapist_id = ? AND appointment_date > date('now') AND status NOT IN ('cancelled', 'no_show')
        `).bind(user?.id || '').first();

        const monthlyRevenue = await c.env.DB.prepare(`
          SELECT SUM(price_cents) as revenue FROM appointments 
          WHERE therapist_id = ? AND strftime('%Y-%m', appointment_date) = strftime('%Y-%m', 'now') AND status = 'completed'
        `).bind(user?.id || '').first();

        stats = {
          todayAppointments: todayCount?.count || 0,
          upcomingAppointments: upcomingCount?.count || 0,
          monthlyRevenue: monthlyRevenue?.revenue || 0,
          averageRating: 4.8, // Mock value
        };
      } else if (role === 'admin') {
        // Admin stats
        const totalAppointments = await c.env.DB.prepare(`
          SELECT COUNT(*) as count FROM appointments
        `).first();

        const pendingAppointments = await c.env.DB.prepare(`
          SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'
        `).first();

        const totalRevenue = await c.env.DB.prepare(`
          SELECT SUM(price_cents) as revenue FROM appointments WHERE status = 'completed'
        `).first();

        const customerCount = await c.env.DB.prepare(`
          SELECT COUNT(DISTINCT customer_id) as count FROM appointments
        `).first();

        stats = {
          totalAppointments: totalAppointments?.count || 0,
          pendingAppointments: pendingAppointments?.count || 0,
          totalRevenue: totalRevenue?.revenue || 0,
          totalCustomers: customerCount?.count || 0,
        };
      }

      return c.json({ role, stats });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return c.json({ 
        role: 'customer', 
        stats: {} 
      });
    }
  });

  // Book appointment with enhanced features
  app.post('/api/appointments', authMiddleware, zValidator('json', z.object({
    service_id: z.number(),
    duration_minutes: z.number(),
    appointment_date: z.string(),
    start_time: z.string(),
    location: z.string(),
    session_goals: z.object({
      primary_goals: z.array(z.string()),
      notes: z.string().optional()
    }).optional(),
    final_price_cents: z.number().optional(),
    stripe_product_id: z.string().optional(),
    stripe_price_id: z.string().optional()
  })), async (c) => {
    const user = c.get('user');
    const { 
      service_id, 
      duration_minutes, 
      appointment_date, 
      start_time, 
      location, 
      session_goals,
      final_price_cents,
      stripe_product_id,
      stripe_price_id
    } = c.req.valid('json');

    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    try {
      // Get service details
      const service = await c.env.DB.prepare('SELECT * FROM services WHERE id = ?')
        .bind(service_id)
        .first();
        
      if (!service) {
        return c.json({ error: 'Service not found' }, 404);
      }

      const finalPrice = final_price_cents || service.price_cents;
      
      // Calculate end time
      const startHour = parseInt(start_time.split(':')[0] || '0');
      const startMinute = parseInt(start_time.split(':')[1] || '0');
      const endHour = Math.floor((startHour * 60 + startMinute + duration_minutes) / 60);
      const endMinute = (startHour * 60 + startMinute + duration_minutes) % 60;
      const end_time = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

      // Create appointment
      const result = await c.env.DB.prepare(`
        INSERT INTO appointments (
          customer_id, therapist_id, service_id, appointment_date,
          start_time, end_time, location_type, price_cents, customer_notes,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `).bind(
        user.id,
        'therapist-1',
        service_id,
        appointment_date,
        start_time,
        end_time,
        location || 'barcelona',
        finalPrice,
        JSON.stringify(session_goals || {})
      ).run();

      // Store Stripe information if provided
      if (stripe_product_id && stripe_price_id && result.meta.last_row_id) {
        await c.env.DB.prepare(`
          UPDATE appointments SET 
            internal_notes = ?
          WHERE id = ?
        `).bind(
          JSON.stringify({
            stripe_product_id,
            stripe_price_id,
            weekend_pricing: final_price_cents !== service.price_cents
          }),
          result.meta.last_row_id
        ).run();
      }

      return c.json({ 
        success: true, 
        appointment_id: result.meta.last_row_id 
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      return c.json({ error: 'Failed to create appointment' }, 500);
    }
  });

  // Submit assessment
  app.post('/api/assessment', authMiddleware, zValidator('json', z.object({
    tension_areas: z.array(z.string()),
    goals: z.array(z.string()),
    stress_level: z.number(),
    energy_level: z.number(),
    previous_experience: z.boolean(),
    previous_experience_details: z.string(),
    improvement_goals: z.string()
  })), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');

    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    try {
      await c.env.DB.prepare(`
        INSERT INTO user_assessments (
          user_id, tension_areas, goals, stress_level, energy_level,
          previous_experience, previous_experience_details, improvement_goals,
          completed_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `).bind(
        user.id,
        JSON.stringify(data.tension_areas),
        JSON.stringify(data.goals),
        data.stress_level,
        data.energy_level,
        data.previous_experience ? 1 : 0,
        data.previous_experience_details,
        data.improvement_goals
      ).run();

      return c.json({ success: true });
    } catch (error) {
      console.error('Error saving assessment:', error);
      return c.json({ error: 'Failed to save assessment' }, 500);
    }
  });

  // Get enhanced recommendations
  app.get('/api/recommendations', authMiddleware, async (c) => {
    const user = c.get('user');
    
    if (!user?.id) {
      return c.json({ recommendations: [] });
    }
    
    try {
      // Get latest assessment
      const assessment = await c.env.DB.prepare(`
        SELECT * FROM user_assessments 
        WHERE user_id = ? 
        ORDER BY completed_at DESC 
        LIMIT 1
      `).bind(user.id).first();

      if (!assessment) {
        return c.json({ recommendations: [] });
      }

      // Get all session types
      const sessionTypes = await c.env.DB.prepare(`
        SELECT * FROM session_types WHERE is_active = 1
      `).all();

      // Simple recommendation logic based on assessment
      const tensionAreas = JSON.parse(String(assessment.tension_areas) || '[]');
      const goals = JSON.parse(String(assessment.goals) || '[]');
      const stressLevel = Number(assessment.stress_level) || 5;
      
      const recommendations = sessionTypes.results.map((session: any) => {
        let priorityScore = 50; // Base score
        let reason = '';

        // Scoring based on tension areas and goals
        if (session.name.includes('Massatge') && (tensionAreas.includes('back') || tensionAreas.includes('shoulders'))) {
          priorityScore += 30;
          reason = 'Ideal per alleujar les tensions físiques que has reportat.';
        }
        
        if (session.name.includes('Kinesiologia') && (goals.includes('energy') || stressLevel > 7)) {
          priorityScore += 25;
          reason = 'Perfecte per equilibrar la teva energia i reduir l\'estrès.';
        }
        
        if (session.name.includes('Feldenkrais') && (tensionAreas.includes('neck') || goals.includes('correction'))) {
          priorityScore += 20;
          reason = 'Ajudarà amb la consciència corporal i la postura.';
        }

        if (session.name.includes('Combinada') && !assessment.previous_experience) {
          priorityScore += 15;
          reason = 'Una introducció perfecta a múltiples tècniques terapèutiques.';
        }

        return {
          id: Math.random(), // Temporary ID
          session_type_id: session.id,
          session_type_name: session.name,
          session_type_description: session.description,
          base_price_cents: session.base_price_cents,
          reason: reason || 'Recomanat segons el teu perfil.',
          priority_score: Math.min(priorityScore, 100)
        };
      }).sort((a: any, b: any) => b.priority_score - a.priority_score);

      return c.json({ 
        recommendations: recommendations.slice(0, 3) 
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return c.json({ recommendations: [] });
    }
  });

  // Therapist availability endpoints
  app.get('/api/therapist/availability', authMiddleware, async (c) => {
    const user = c.get('user');
    
    if (!user?.id) {
      return c.json([]);
    }
    
    try {
      const availability = await c.env.DB.prepare(`
        SELECT * FROM therapist_availability WHERE therapist_id = ? ORDER BY day_of_week
      `).bind(user.id).all();

      return c.json(availability.results || []);
    } catch (error) {
      console.error('Error fetching therapist availability:', error);
      return c.json([]);
    }
  });

  app.post('/api/therapist/availability', authMiddleware, zValidator('json', z.object({
    day_of_week: z.number(),
    start_time: z.string(),
    end_time: z.string(),
    is_available: z.boolean()
  })), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');

    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    try {
      // Check if availability exists for this day
      const existing = await c.env.DB.prepare(`
        SELECT id FROM therapist_availability WHERE therapist_id = ? AND day_of_week = ?
      `).bind(user.id, data.day_of_week).first();

      if (existing) {
        // Update existing
        await c.env.DB.prepare(`
          UPDATE therapist_availability SET 
            start_time = ?, end_time = ?, is_available = ?, updated_at = datetime('now')
          WHERE therapist_id = ? AND day_of_week = ?
        `).bind(
          data.start_time, data.end_time, data.is_available ? 1 : 0,
          user.id, data.day_of_week
        ).run();
      } else {
        // Create new
        await c.env.DB.prepare(`
          INSERT INTO therapist_availability (
            therapist_id, day_of_week, start_time, end_time, is_available,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `).bind(
          user.id, data.day_of_week, data.start_time, data.end_time,
          data.is_available ? 1 : 0
        ).run();
      }

      return c.json({ success: true });
    } catch (error) {
      console.error('Error updating therapist availability:', error);
      return c.json({ error: 'Failed to update availability' }, 500);
    }
  });

  // Update appointment status
  app.patch('/api/appointments/:id/status', authMiddleware, zValidator('json', z.object({
    status: z.string(),
    notes: z.string().optional()
  })), async (c) => {
    const appointmentId = c.req.param('id');
    const { status, notes } = c.req.valid('json');

    try {
      await c.env.DB.prepare(`
        UPDATE appointments SET 
          status = ?, therapist_notes = ?, updated_at = datetime('now')
        WHERE id = ?
      `).bind(status, notes || null, appointmentId).run();

      return c.json({ success: true });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      return c.json({ error: 'Failed to update appointment' }, 500);
    }
  });

  // Submit user feedback
  app.post('/api/feedback', authMiddleware, zValidator('json', z.object({
    type: z.string(),
    rating: z.number().optional(),
    message: z.string().optional(),
    page: z.string().optional()
  })), async (c) => {
    const user = c.get('user');
    const { type, rating, message, page } = c.req.valid('json');

    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    try {
      await c.env.DB.prepare(`
        INSERT INTO user_feedback (
          user_id, feedback_type, rating, message, page, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `).bind(
        user.id,
        type,
        rating || null,
        message || null,
        page || null
      ).run();

      return c.json({ success: true });
    } catch (error) {
      console.error('Error saving feedback:', error);
      return c.json({ error: 'Failed to save feedback' }, 500);
    }
  });

  // Contact form submission
  app.post('/api/contact', zValidator('json', z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    service: z.string().optional(),
    message: z.string().min(1),
    preferred_contact: z.enum(['email', 'phone']).optional(),
    preferred_time: z.string().optional()
  })), async (c) => {
    const data = c.req.valid('json');

    try {
      await c.env.DB.prepare(`
        INSERT INTO contact_submissions (
          name, email, phone, service, message, preferred_contact, preferred_time,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `).bind(
        data.name,
        data.email,
        data.phone || null,
        data.service || null,
        data.message,
        data.preferred_contact || 'email',
        data.preferred_time || null
      ).run();

      return c.json({ success: true });
    } catch (error) {
      console.error('Error saving contact submission:', error);
      return c.json({ error: 'Failed to save contact submission' }, 500);
    }
  });

  // Features toggle endpoints
  app.get('/api/features', async (c) => {
    try {
      const features = await c.env.DB.prepare(`
        SELECT * FROM features_toggle ORDER BY name
      `).all();

      return c.json(features.results || []);
    } catch (error) {
      console.error('Error fetching features:', error);
      return c.json([]);
    }
  });

  app.get('/api/features/:key', async (c) => {
    const key = c.req.param('key');
    
    try {
      const feature = await c.env.DB.prepare(`
        SELECT * FROM features_toggle WHERE key = ?
      `).bind(key).first();

      return c.json(feature || { enabled: false });
    } catch (error) {
      console.error('Error fetching feature:', error);
      return c.json({ enabled: false });
    }
  });

  app.patch('/api/features/:key', authMiddleware, zValidator('json', z.object({
    enabled: z.boolean()
  })), async (c) => {
    const user = c.get('user');
    const key = c.req.param('key');
    const { enabled } = c.req.valid('json');

    // Check if user is admin
    try {
      const profile = await c.env.DB.prepare(`
        SELECT is_admin FROM user_profiles WHERE user_id = ?
      `).bind(user?.id || '').first();
      
      if (!profile?.is_admin) {
        return c.json({ error: 'Unauthorized' }, 403);
      }

      await c.env.DB.prepare(`
        UPDATE features_toggle SET enabled = ?, updated_at = datetime('now') WHERE key = ?
      `).bind(enabled ? 1 : 0, key).run();

      return c.json({ success: true });
    } catch (error) {
      console.error('Error updating feature:', error);
      return c.json({ error: 'Failed to update feature' }, 500);
    }
  });

  // Find therapist to chat with
  app.get('/api/chat/find-therapist', authMiddleware, async (c) => {
    const user = c.get('user');

    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    try {
      // Find a therapist or admin to chat with
      const therapist = await c.env.DB.prepare(`
        SELECT user_id FROM user_profiles 
        WHERE (is_therapist = 1 OR is_admin = 1) AND is_active = 1 
        ORDER BY is_admin DESC, created_at ASC 
        LIMIT 1
      `).first();

      if (therapist) {
        return c.json({ therapist_id: therapist.user_id });
      } else {
        return c.json({ therapist_id: null });
      }
    } catch (error) {
      console.error('Error finding therapist:', error);
      return c.json({ therapist_id: null });
    }
  });

  // Chat endpoints
  app.post('/api/chat/send', authMiddleware, zValidator('json', z.object({
    receiver_id: z.string(),
    message: z.string().min(1).max(1000)
  })), async (c) => {
    const user = c.get('user');
    const { receiver_id, message } = c.req.valid('json');

    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    try {
      const result = await c.env.DB.prepare(`
        INSERT INTO chat_messages (
          sender_id, receiver_id, message, created_at, updated_at
        ) VALUES (?, ?, ?, datetime('now'), datetime('now'))
      `).bind(user.id, receiver_id, message).run();

      return c.json({ 
        success: true, 
        message_id: result.meta.last_row_id 
      });
    } catch (error) {
      console.error('Error sending message:', error);
      return c.json({ error: 'Failed to send message' }, 500);
    }
  });

  app.get('/api/chat/conversation/:userId', authMiddleware, async (c) => {
    const user = c.get('user');
    const otherUserId = c.req.param('userId');

    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    try {
      const messages = await c.env.DB.prepare(`
        SELECT 
          cm.*,
          up_sender.first_name as sender_name,
          up_receiver.first_name as receiver_name
        FROM chat_messages cm
        LEFT JOIN user_profiles up_sender ON cm.sender_id = up_sender.user_id
        LEFT JOIN user_profiles up_receiver ON cm.receiver_id = up_receiver.user_id
        WHERE (cm.sender_id = ? AND cm.receiver_id = ?) 
           OR (cm.sender_id = ? AND cm.receiver_id = ?)
        ORDER BY cm.created_at ASC
      `).bind(user.id, otherUserId, otherUserId, user.id).all();

      return c.json(messages.results || []);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return c.json([]);
    }
  });

  app.get('/api/chat/conversations', authMiddleware, async (c) => {
    const user = c.get('user');

    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    try {
      const conversations = await c.env.DB.prepare(`
        SELECT DISTINCT
          CASE 
            WHEN cm.sender_id = ? THEN cm.receiver_id 
            ELSE cm.sender_id 
          END as other_user_id,
          up.first_name,
          up.last_name,
          up.role,
          MAX(cm.created_at) as last_message_time,
          (SELECT COUNT(*) FROM chat_messages 
           WHERE receiver_id = ? AND sender_id = other_user_id AND is_read = 0) as unread_count
        FROM chat_messages cm
        LEFT JOIN user_profiles up ON (
          CASE 
            WHEN cm.sender_id = ? THEN cm.receiver_id 
            ELSE cm.sender_id 
          END = up.user_id
        )
        WHERE cm.sender_id = ? OR cm.receiver_id = ?
        GROUP BY other_user_id
        ORDER BY last_message_time DESC
      `).bind(user.id, user.id, user.id, user.id, user.id).all();

      return c.json(conversations.results || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return c.json([]);
    }
  });

  app.patch('/api/chat/mark-read', authMiddleware, zValidator('json', z.object({
    sender_id: z.string()
  })), async (c) => {
    const user = c.get('user');
    const { sender_id } = c.req.valid('json');

    if (!user?.id) {
      return c.json({ error: 'User not authenticated' }, 401);
    }

    try {
      await c.env.DB.prepare(`
        UPDATE chat_messages 
        SET is_read = 1, updated_at = datetime('now')
        WHERE receiver_id = ? AND sender_id = ? AND is_read = 0
      `).bind(user.id, sender_id).run();

      return c.json({ success: true });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return c.json({ error: 'Failed to mark messages as read' }, 500);
    }
  });

  return app;
}
