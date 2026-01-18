/**
 * AI Tool Blocks
 * Functions exposed to the LLM to interact with the system on behalf of the user.
 * Enhanced with wellness tracking, recommendations, insights, and more.
 */
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import * as wellnessService from './wellness-service';
import * as recommendationEngine from './recommendation-engine';
import * as insightsService from './ai-insights-service';
import * as memoryService from './ai-memory-service';
import * as personalizationService from './ai-personalization-service';

export interface AITool<P = any> {
  description: string;
  parameters: z.ZodSchema<P>;
  execute: (args: P) => Promise<any>;
}

// ============================================================================
// BOOKING TOOLS
// ============================================================================

const getMyBookingsSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'canceled', 'all']).optional().describe('Filter by booking status'),
});

export const getMyBookings: AITool = {
  description: 'Get a list of the current user\'s bookings (past and upcoming).',
  parameters: getMyBookingsSchema,
  execute: async ({ status }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'User not logged in' };
    }

    const { data: profile } = await supabase.from('profiles').select('id').eq('auth_id', user.id).single();
    if (!profile) return { error: 'Profile not found' };

    let query = supabase
      .from('booking')
      .select('*, service(name), staff(name)')
      .eq('email', user.email)
      .order('start_time', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) return { error: error.message };

    return { bookings: data };
  },
};

export const checkAvailability: AITool = {
  description: 'Check available time slots for a specific service on a given date.',
  parameters: z.object({
    serviceId: z.string().describe('The ID of the service to check'),
    date: z.string().describe('The date to check in YYYY-MM-DD format'),
  }),
  execute: async ({ serviceId, date }) => {
    const { getAvailableSlotsAction } = await import('@/server/actions/booking-actions');
    const result = await getAvailableSlotsAction(serviceId, date);
    if (!result.success) {
      return { error: result.error };
    }
    return { slots: result.data?.slots };
  },
};

export const cancelBooking: AITool = {
  description: 'Cancel a booking for the current user.',
  parameters: z.object({
    bookingId: z.string().describe('The ID of the booking to cancel'),
    reason: z.string().optional().describe('Reason for cancellation'),
  }),
  execute: async ({ bookingId, reason }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { cancelBookingAction } = await import('@/server/actions/booking-actions');
    const result = await cancelBookingAction(bookingId, user.id);
    return result;
  },
};

export const bookAppointment: AITool = {
  description: 'Book an appointment for a service at a specific time. REQUIRES a confirmed time slot from checkAvailability.',
  parameters: z.object({
    serviceId: z.string().describe('The ID of the service to book'),
    serviceVariantId: z.string().optional().describe('The ID of the specific variant if known'),
    dateTime: z.string().describe('The start time in ISO format'),
  }),
  execute: async ({ serviceId, serviceVariantId, dateTime }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'You must be logged in to book an appointment.' };
    }

    const { data: profile } = await supabase.from('profiles').select('full_name, phone').eq('auth_id', user.id).single();
    const displayName = profile?.full_name || 'Guest User';
    const phone = profile?.phone;

    const { fetchService, createBooking } = await import('@/server/booking/service');

    if (!serviceVariantId) {
      const sData = await fetchService(serviceId);
      if (sData.data && (sData.data as any).variants && (sData.data as any).variants.length > 0) {
        serviceVariantId = (sData.data as any).variants[0].id;
      }
    }

    const res = await createBooking({
      serviceId,
      serviceVariantId,
      startTime: dateTime,
      userId: user.id,
      email: user.email!,
      displayName,
      phone: phone || undefined,
      paymentMode: 'full',
      originApp: 'ai-concierge'
    });

    return {
      success: true,
      bookingId: res.data?.bookingId,
      message: 'Booking created successfully',
      details: {
        serviceId,
        dateTime
      }
    };
  },
};

export const getBookingPreview: AITool = {
  description: 'Generate a visual booking confirmation preview for the user to review before final booking. Use this when a user selects a slot but hasn\'t confirmed yet.',
  parameters: z.object({
    serviceId: z.string().describe('The ID of the service'),
    dateTime: z.string().describe('The selected date and time in ISO format'),
    serviceVariantId: z.string().optional().describe('The ID of the specific variant if known'),
  }),
  execute: async ({ serviceId, dateTime, serviceVariantId }) => {
    const supabase = await createClient();
    const { data: service } = await supabase
      .from('service')
      .select('id, name, description, price_amount, duration_min')
      .eq('id', serviceId)
      .single();

    if (!service) return { error: 'Service not found' };

    let variant = null;
    if (serviceVariantId) {
      const { data: vData } = await supabase
        .from('service_variant')
        .select('*')
        .eq('id', serviceVariantId)
        .single();
      variant = vData;
    }

    return {
      preview: {
        serviceId: service.id,
        serviceName: service.name,
        description: service.description,
        price: variant?.price_amount ?? service.price_amount,
        duration: variant?.duration_min ?? service.duration_min,
        dateTime,
        variantName: variant?.name,
        serviceVariantId
      }
    };
  },
};

// ============================================================================
// WALLET & FINANCE TOOLS
// ============================================================================

export const getWalletBalance: AITool = {
  description: 'Get the current wallet balance of the user.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase.from('profiles').select('id').eq('auth_id', user.id).single();
    if (!profile) return { error: 'Profile not found' };

    const { data: wallet } = await supabase
      .from('user_wallet')
      .select('balance_cents, currency')
      .eq('user_id', user.id)
      .single();

    if (!wallet) return { balance: 0, currency: 'USD' };

    return {
      balance: wallet.balance_cents / 100,
      currency: wallet.currency
    };
  },
};

export const getRewardsBalance: AITool = {
  description: 'Get the user\'s loyalty rewards points balance and recent reward activity.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: rewards } = await supabase
      .from('user_rewards_balance')
      .select('points_balance, lifetime_points, tier')
      .eq('user_id', user.id)
      .single();

    if (!rewards) return { points: 0, lifetimePoints: 0, tier: 'bronze' };

    return {
      points: rewards.points_balance,
      lifetimePoints: rewards.lifetime_points,
      tier: rewards.tier
    };
  },
};

export const getWalletHistory: AITool = {
  description: 'Get a list of recent wallet transactions including deposits, purchases, and refunds.',
  parameters: z.object({
    limit: z.number().optional().describe('Number of transactions to fetch (default 10)'),
  }),
  execute: async ({ limit = 10 }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { WalletService } = await import('@/server/wallet/service');
    const service = new WalletService();
    const transactions = await service.getTransactions(user.id);

    return {
      transactions: transactions.slice(0, limit).map(t => ({
        id: t.id,
        amount: t.amount_cents / 100,
        type: t.type,
        description: t.description,
        date: t.created_at,
        referenceId: t.reference_id
      }))
    };
  },
};

// ============================================================================
// SERVICE TOOLS
// ============================================================================

export const searchServices: AITool = {
  description: 'Search for available services to book.',
  parameters: z.object({
    query: z.string().optional().describe('Search term like \'massage\' or \'consultation\''),
    category: z.string().optional().describe('Filter by service category'),
  }),
  execute: async ({ query, category }) => {
    const supabase = await createClient();
    let q = supabase.from('service').select('id, name, description, price_amount, duration_min, category').eq('active', true);

    if (query) {
      q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }
    if (category) {
      q = q.eq('category', category);
    }

    const { data } = await q;
    return { services: data };
  },
};

export const getServiceDetails: AITool = {
  description: 'Get detailed information about a specific service including variants and pricing.',
  parameters: z.object({
    serviceId: z.string().describe('The ID of the service'),
  }),
  execute: async ({ serviceId }) => {
    const supabase = await createClient();

    const { data: service } = await supabase
      .from('service')
      .select('*, service_variant(*)')
      .eq('id', serviceId)
      .single() as { data: any, error: any };

    if (!service) return { error: 'Service not found' };

    return {
      service: {
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration_min,
        price: service.price_amount,
        category: service.category,
        variants: service.service_variant || []
      }
    };
  },
};

export const compareServices: AITool = {
  description: 'Compare multiple services side-by-side to help the user choose.',
  parameters: z.object({
    serviceIds: z.array(z.string()).describe('List of service IDs to compare'),
  }),
  execute: async ({ serviceIds }) => {
    const supabase = await createClient();
    const { data: services } = await supabase
      .from('service')
      .select('id, name, description, price_amount, duration_min, category')
      .in('id', serviceIds);

    return { services: services || [] };
  },
};

// ============================================================================
// WELLNESS & MOOD TOOLS
// ============================================================================

export const logMoodCheckIn: AITool = {
  description: 'Log a mood check-in entry. Call this when user wants to track their mood, emotions, or how they\'re feeling.',
  parameters: z.object({
    mood: z.number().min(1).max(10).describe('Mood rating from 1 (very low) to 10 (excellent)'),
    energy: z.enum(['very_low', 'low', 'moderate', 'high', 'very_high']).describe('Energy level'),
    stress: z.enum(['minimal', 'mild', 'moderate', 'high', 'severe']).describe('Stress level'),
    notes: z.string().optional().describe('Optional notes about how they\'re feeling'),
    emotions: z.array(z.string()).optional().describe('Array of emotions like ["happy", "anxious", "calm"]'),
    activities: z.array(z.string()).optional().describe('Activities done today like ["exercise", "meditation"]'),
    sleepHours: z.number().optional().describe('Hours of sleep last night'),
    sleepQuality: z.number().min(1).max(5).optional().describe('Sleep quality from 1-5'),
  }),
  execute: async ({ mood, energy, stress, notes, emotions, activities, sleepHours, sleepQuality }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const entry = await wellnessService.createMoodEntry(user.id, {
      mood: mood as wellnessService.MoodLevel,
      energy,
      stress,
      notes,
      emotions,
      activities,
      sleepHours,
      sleepQuality
    });

    if (!entry) return { error: 'Failed to save mood entry' };

    return {
      success: true,
      message: 'Mood check-in saved successfully',
      entry: {
        id: entry.id,
        mood: entry.mood,
        energy: entry.energy,
        stress: entry.stress
      }
    };
  },
};

export const getWellnessSummary: AITool = {
  description: 'Get a summary of the user\'s wellness data including mood trends, common emotions, and streak.',
  parameters: z.object({
    period: z.enum(['day', 'week', 'month']).optional().describe('Time period for the summary'),
  }),
  execute: async ({ period = 'week' }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const summary = await wellnessService.getWellnessSummary(user.id, period);

    return {
      period,
      averageMood: summary.averageMood,
      moodTrend: summary.moodTrend,
      commonEmotions: summary.commonEmotions.slice(0, 3),
      averageSleep: summary.averageSleep,
      streakDays: summary.streakDays,
      totalEntries: summary.totalEntries
    };
  },
};

export const getMoodHistory: AITool = {
  description: 'Get the user\'s recent mood entries for review.',
  parameters: z.object({
    days: z.number().optional().describe('Number of days of history (default 14)'),
  }),
  execute: async ({ days = 14 }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const entries = await wellnessService.getMoodEntries(user.id, days);

    return {
      entries: entries.slice(0, 10).map(e => ({
        date: e.createdAt,
        mood: e.mood,
        energy: e.energy,
        stress: e.stress,
        emotions: e.emotions
      }))
    };
  },
};

export const setWellnessGoal: AITool = {
  description: 'Create a new wellness goal for the user to track.',
  parameters: z.object({
    title: z.string().describe('Goal title like "Reduce stress" or "Better sleep"'),
    targetType: z.enum(['mood', 'stress', 'sleep', 'activity', 'custom']).describe('Type of goal'),
    targetValue: z.number().describe('Target value (e.g., mood of 7, 8 hours sleep)'),
    description: z.string().optional().describe('Optional description'),
  }),
  execute: async ({ title, targetType, targetValue, description }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const goal = await wellnessService.createWellnessGoal(
      user.id,
      title,
      targetType,
      targetValue,
      description
    );

    if (!goal) return { error: 'Failed to create goal' };

    return {
      success: true,
      message: 'Wellness goal created',
      goal: {
        id: goal.id,
        title: goal.title,
        targetType: goal.targetType,
        targetValue: goal.targetValue
      }
    };
  },
};

export const getWellnessGoals: AITool = {
  description: 'Get the user\'s active wellness goals and their progress.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const goals = await wellnessService.getActiveGoals(user.id);

    return {
      goals: goals.map(g => ({
        id: g.id,
        title: g.title,
        targetType: g.targetType,
        targetValue: g.targetValue,
        currentValue: g.currentValue,
        progress: g.progress,
        status: g.status
      }))
    };
  },
};

// ============================================================================
// RECOMMENDATION TOOLS
// ============================================================================

export const getRecommendations: AITool = {
  description: 'Get personalized recommendations for services, exercises, and actions based on user preferences and wellness data.',
  parameters: z.object({
    type: z.enum(['all', 'services', 'exercises', 'actions']).optional().describe('Type of recommendations to get'),
  }),
  execute: async ({ type = 'all' }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    if (type === 'all') {
      const recs = await recommendationEngine.getAllRecommendations(user.id);
      return {
        services: recs.services.slice(0, 3),
        exercises: recs.exercises.slice(0, 3),
        actions: recs.actions.slice(0, 3)
      };
    }

    if (type === 'services') {
      const services = await recommendationEngine.generateServiceRecommendations(user.id, 5);
      return { services };
    }

    if (type === 'exercises') {
      const exercises = await recommendationEngine.generateExerciseRecommendations(user.id, 5);
      return { exercises };
    }

    if (type === 'actions') {
      const actions = await recommendationEngine.generateActionRecommendations(user.id);
      return { actions };
    }

    return { error: 'Invalid recommendation type' };
  },
};

export const getWellnessRecommendations: AITool = {
  description: 'Get wellness-specific recommendations based on recent mood and health data.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const recommendations = await wellnessService.generateWellnessRecommendations(user.id);

    return { recommendations };
  },
};

// ============================================================================
// INSIGHTS TOOLS
// ============================================================================

export const getInsights: AITool = {
  description: 'Get AI-generated insights about the user\'s wellness journey, patterns, and progress.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const insights = await insightsService.getActiveInsights(user.id);

    return {
      insights: insights.slice(0, 5).map(i => ({
        id: i.id,
        type: i.type,
        title: i.title,
        description: i.description,
        priority: i.priority,
        actionItems: i.actionItems?.filter(a => !a.completed).slice(0, 2)
      }))
    };
  },
};

export const getWellnessScore: AITool = {
  description: 'Get the user\'s overall wellness score with breakdown by category.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const score = await insightsService.calculateWellnessScore(user.id);

    return {
      overall: score.overall,
      breakdown: {
        mood: score.mood,
        stress: score.stress,
        engagement: score.engagement,
        consistency: score.consistency
      },
      trend: score.trend
    };
  },
};

export const completeInsightAction: AITool = {
  description: 'Mark an insight action item as completed.',
  parameters: z.object({
    insightId: z.string().describe('The insight ID'),
    actionItemId: z.string().describe('The action item ID to complete'),
  }),
  execute: async ({ insightId, actionItemId }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const success = await insightsService.completeActionItem(insightId, actionItemId, user.id);

    return success
      ? { success: true, message: 'Action completed!' }
      : { error: 'Failed to complete action' };
  },
};

// ============================================================================
// MEMORY & CONTEXT TOOLS
// ============================================================================

export const rememberThis: AITool = {
  description: 'Store an important piece of information about the user for future reference.',
  parameters: z.object({
    content: z.string().describe('What to remember about the user'),
    type: z.enum(['preference', 'fact', 'goal', 'observation']).describe('Type of memory'),
    importance: z.number().min(1).max(5).optional().describe('Importance level 1-5'),
  }),
  execute: async ({ content, type, importance = 3 }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const memory = await memoryService.createMemory(user.id, content, type, importance);

    return memory
      ? { success: true, message: 'I\'ll remember that!' }
      : { error: 'Failed to save memory' };
  },
};

export const getMemories: AITool = {
  description: 'Recall stored information about the user.',
  parameters: z.object({
    type: z.enum(['preference', 'fact', 'goal', 'observation', 'all']).optional().describe('Filter by memory type'),
  }),
  execute: async ({ type = 'all' }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const types = type === 'all' ? undefined : [type as memoryService.MemoryType];
    const memories = await memoryService.getRecentMemories(user.id, 10, types);

    return {
      memories: memories.map(m => ({
        content: m.content,
        type: m.memoryType,
        importance: m.importance,
        date: m.createdAt
      }))
    };
  },
};

// ============================================================================
// PROFILE & PREFERENCES TOOLS
// ============================================================================

export const getUserProfile: AITool = {
  description: 'Get the user\'s profile information and preferences.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, phone, date_of_birth, language, personalization_data')
      .eq('auth_id', user.id)
      .single();

    if (!profile) return { error: 'Profile not found' };

    return {
      name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      language: profile.language,
      preferences: profile.personalization_data || {}
    };
  },
};

export const updatePreferences: AITool = {
  description: 'Update user preferences for personalization.',
  parameters: z.object({
    goals: z.array(z.string()).optional().describe('Wellness goals'),
    preferredDuration: z.number().optional().describe('Preferred session duration in minutes'),
    focusAreas: z.array(z.string()).optional().describe('Body areas to focus on'),
    communicationStyle: z.enum(['formal', 'casual', 'supportive']).optional().describe('Preferred communication style'),
  }),
  execute: async ({ goals, preferredDuration, focusAreas, communicationStyle }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const updates: Record<string, unknown> = {};
    if (goals) updates.goals = goals;
    if (preferredDuration) updates.preferredDuration = preferredDuration;
    if (focusAreas) updates.focusAreas = focusAreas;
    if (communicationStyle) updates.communicationStyle = communicationStyle;

    const { error } = await supabase
      .from('profiles')
      .update({ personalization_data: updates })
      .eq('auth_id', user.id);

    if (error) return { error: 'Failed to update preferences' };

    return { success: true, message: 'Preferences updated successfully' };
  },
};

// ============================================================================
// JOURNAL TOOLS
// ============================================================================

export const createJournalEntry: AITool = {
  description: 'Create a journal entry for the user\'s thoughts and reflections.',
  parameters: z.object({
    content: z.string().describe('The journal entry content'),
    mood: z.number().min(1).max(10).optional().describe('Associated mood 1-10'),
    tags: z.array(z.string()).optional().describe('Tags for the entry'),
    isPrivate: z.boolean().optional().describe('Whether entry is private'),
  }),
  execute: async ({ content, mood, tags, isPrivate = true }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        content,
        mood,
        tags: tags || [],
        is_private: isPrivate
      })
      .select('id')
      .single();

    if (error) return { error: 'Failed to create journal entry' };

    // Also create a memory for context
    await memoryService.createMemory(
      user.id,
      `Journal entry: ${content.substring(0, 100)}...`,
      'observation',
      3,
      { entryId: data.id, mood }
    );

    return {
      success: true,
      message: 'Journal entry saved',
      entryId: data.id
    };
  },
};

export const getJournalEntries: AITool = {
  description: 'Get recent journal entries.',
  parameters: z.object({
    limit: z.number().optional().describe('Number of entries to return'),
  }),
  execute: async ({ limit = 5 }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: entries } = await supabase
      .from('journal_entries')
      .select('id, content, mood, tags, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    return {
      entries: (entries || []).map(e => ({
        id: e.id,
        content: e.content.substring(0, 200) + (e.content.length > 200 ? '...' : ''),
        mood: e.mood,
        tags: e.tags,
        date: e.created_at
      }))
    };
  },
};

// ============================================================================
// PERSONALIZATION TOOLS
// ============================================================================

export const getPersonalizedGreeting: AITool = {
  description: 'Get a personalized greeting based on time of day, mood, and user context. Call this to warmly greet the user.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { greeting: 'Hello! How can I help you today?', emoji: '👋' };

    const result = await personalizationService.generatePersonalizedGreeting(user.id);
    return result;
  },
};

export const suggestDailyActions: AITool = {
  description: 'Get personalized daily action suggestions based on user\'s wellness data and patterns.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const actions = await personalizationService.suggestDailyActions(user.id);
    return { actions };
  },
};

export const analyzeConversation: AITool = {
  description: 'Analyze the sentiment and emotional tone of a user message. Use this to better understand user needs.',
  parameters: z.object({
    message: z.string().describe('The user message to analyze'),
  }),
  execute: async ({ message }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';

    const analysis = await personalizationService.analyzeConversationSentiment(message, userId);
    return { analysis };
  },
};

export const generateAffirmation: AITool = {
  description: 'Generate a personalized affirmation based on user\'s current mood and wellness status.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { affirmation: { text: 'You are capable of amazing things.', category: 'general', relatedToMood: false } };

    const affirmation = await personalizationService.generateAffirmation(user.id);
    return { affirmation };
  },
};

export const getProgressReport: AITool = {
  description: 'Generate a progress report summarizing the user\'s wellness journey over a period of time.',
  parameters: z.object({
    period: z.enum(['week', 'month']).optional().describe('The time period for the report'),
  }),
  execute: async ({ period = 'week' }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const report = await personalizationService.generateProgressReport(user.id, period);
    return { report };
  },
};

export const identifyPatterns: AITool = {
  description: 'Identify behavioral patterns in the user\'s wellness data, such as mood cycles, sleep trends, and stress triggers.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const patterns = await personalizationService.identifyBehavioralPatterns(user.id);
    return { patterns };
  },
};

export const suggestBreathingExercise: AITool = {
  description: 'Suggest a breathing exercise based on the user\'s current stress level and mood.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { exercise: { id: 'box-breathing', name: 'Box Breathing', description: 'A calming technique.', duration: 4, pattern: { inhale: 4, hold: 4, exhale: 4 }, benefits: ['Reduces stress'] } };

    const exercise = await personalizationService.suggestBreathingExercise(user.id);
    return { exercise };
  },
};

export const celebrateAchievement: AITool = {
  description: 'Provide a celebration message for a user achievement or milestone.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const achievements = await personalizationService.celebrateAchievement(user.id);
    return { achievements };
  },
};

export const startGuidedMeditation: AITool = {
  description: 'Start a short guided meditation session for the user.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const session = await personalizationService.startGuidedMeditation(user.id);
    return { session };
  },
};

export const getSleepInsights: AITool = {
  description: 'Provide insights and hygiene tips regarding the user\'s sleep quality and habits.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const insight = await personalizationService.getSleepQualityInsights(user.id);
    return { insight };
  },
};

export const getInteractiveGoalTracker: AITool = {
  description: 'Show the user\'s active wellness goals and their current progress.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const tracker = await personalizationService.getInteractiveGoalTracker(user.id);
    return { tracker };
  },
};

export const getMoodCalendar: AITool = {
  description: 'Provide a 14-day mood calendar visualization.',
  parameters: z.object({}),
  execute: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const days = await personalizationService.getMoodCalendar(user.id);
    return { days };
  },
};

// ============================================================================
// EXPORT ALL TOOLS
// ============================================================================

export const aiTools: Record<string, AITool> = {
  getMyBookings,
  checkAvailability,
  cancelBooking,
  bookAppointment,
  getBookingPreview,

  // Wallet & Finance
  getWalletBalance,
  getRewardsBalance,
  getWalletHistory,

  // Services
  searchServices,
  getServiceDetails,
  compareServices,

  // Wellness & Mood
  logMoodCheckIn,
  getWellnessSummary,
  getMoodHistory,
  setWellnessGoal,
  getWellnessGoals,

  // Recommendations
  getRecommendations,
  getWellnessRecommendations,

  // Insights
  getInsights,
  getWellnessScore,
  completeInsightAction,

  // Memory
  rememberThis,
  getMemories,

  // Profile
  getUserProfile,
  updatePreferences,

  // Journal
  createJournalEntry,
  getJournalEntries,

  // Personalization
  getPersonalizedGreeting,
  suggestDailyActions,
  analyzeConversation,
  generateAffirmation,
  getProgressReport,
  identifyPatterns,
  suggestBreathingExercise,
  celebrateAchievement,
  startGuidedMeditation,
  getSleepInsights,
  getInteractiveGoalTracker,
  getMoodCalendar,
};

// Tool categories for documentation
export const toolCategories = {
  booking: ['getMyBookings', 'checkAvailability', 'cancelBooking', 'bookAppointment', 'getBookingPreview'],
  finance: ['getWalletBalance', 'getRewardsBalance', 'getWalletHistory'],
  services: ['searchServices', 'getServiceDetails', 'compareServices'],
  wellness: ['logMoodCheckIn', 'getWellnessSummary', 'getMoodHistory', 'setWellnessGoal', 'getWellnessGoals'],
  recommendations: ['getRecommendations', 'getWellnessRecommendations'],
  insights: ['getInsights', 'getWellnessScore', 'completeInsightAction'],
  memory: ['rememberThis', 'getMemories'],
  profile: ['getUserProfile', 'updatePreferences'],
  journal: ['createJournalEntry', 'getJournalEntries'],
  personalization: [
    'getPersonalizedGreeting',
    'suggestDailyActions',
    'analyzeConversation',
    'generateAffirmation',
    'getProgressReport',
    'identifyPatterns',
    'suggestBreathingExercise',
    'celebrateAchievement',
    'startGuidedMeditation',
    'getSleepInsights',
    'getInteractiveGoalTracker',
    'getMoodCalendar'
  ]
};
