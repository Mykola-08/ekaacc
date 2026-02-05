/**
 * User Context Service
 * Builds comprehensive user context for AI personalization
 * Gathers all user data the user has access to for better interactions
 *
 * @review - Consider caching for performance optimization
 */
import { db } from '@/lib/db';
import { getWellnessSummary, getMoodEntries } from './wellness-service';
import { getRecentMemories, getImportantMemories } from './ai-memory-service';
import { getActiveInsights, getAIUserProfile } from './ai-insights-service';
import { getAllRecommendations, getUserPreferences } from './recommendation-engine';

export interface UserContext {
  profile: UserProfile;
  preferences: UserPreferencesData;
  wellness: WellnessContext;
  booking: BookingContext;
  financial: FinancialContext;
  interactions: InteractionContext;
  memories: MemoryContext;
  insights: InsightContext;
  computed: ComputedContext;
}

export interface UserProfile {
  id: string;
  authId: string;
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  language: string;
  timezone?: string;
  occupation?: string;
  createdAt: Date;
}

export interface UserPreferencesData {
  goals: string[];
  concerns: string[];
  focusAreas: string[];
  preferredDuration: number;
  preferredTherapistGender?: string;
  communicationStyle?: string;
  stressLevel: number;
  activityLevel: string;
  onboardingAnswers: Record<string, unknown>;
  personalizationData: Record<string, unknown>;
}

export interface WellnessContext {
  averageMood: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  streakDays: number;
  lastCheckIn?: Date;
  recentMoods: { date: Date; mood: number; stress: string }[];
  commonEmotions: string[];
  averageSleep: number;
  stressDistribution: Record<string, number>;
}

export interface BookingContext {
  totalBookings: number;
  completedBookings: number;
  canceledBookings: number;
  upcomingBookings: number;
  lastBookingDate?: Date;
  frequentServices: string[];
  preferredDays: string[];
  preferredTimes: string[];
}

export interface FinancialContext {
  walletBalance: number;
  rewardsPoints: number;
  rewardsTier: string;
  totalSpent: number;
  averageSpend: number;
}

export interface InteractionContext {
  totalInteractions: number;
  lastInteractionDate?: Date;
  commonInteractionTypes: string[];
  conversationCount: number;
  averageMessagesPerConversation: number;
}

export interface MemoryContext {
  totalMemories: number;
  preferences: string[];
  goals: string[];
  facts: string[];
  recentObservations: string[];
  importantItems: string[];
}

export interface InsightContext {
  activeInsights: { title: string; type: string; priority: string }[];
  pendingActions: string[];
  wellnessScore: number;
}

export interface ComputedContext {
  userType: 'new' | 'active' | 'returning' | 'engaged' | 'at_risk';
  engagementLevel: 'low' | 'medium' | 'high';
  nextBestAction: string;
  personalizedGreeting: string;
  suggestedTopics: string[];
}

/**
 * Build comprehensive user context for AI
 */
export async function buildUserContext(userId: string): Promise<UserContext | null> {
  try {
    // Parallel fetch of all user data
    const [
      profileData,
      preferencesData,
      wellnessData,
      bookingData,
      financialData,
      interactionData,
      memoriesData,
      insightsData
    ] = await Promise.all([
      getProfileContext(userId),
      getPreferencesContext(userId),
      getWellnessContext(userId),
      getBookingContext(userId),
      getFinancialContext(userId),
      getInteractionContext(userId),
      getMemoriesContext(userId),
      getInsightsContext(userId)
    ]);

    if (!profileData) return null;

    // Compute derived context
    const computed = computeDerivedContext(
      profileData,
      preferencesData,
      wellnessData,
      bookingData,
      interactionData
    );

    return {
      profile: profileData,
      preferences: preferencesData,
      wellness: wellnessData,
      booking: bookingData,
      financial: financialData,
      interactions: interactionData,
      memories: memoriesData,
      insights: insightsData,
      computed
    };
  } catch (error) {
    console.error('Error building user context:', error);
    return null;
  }
}

/**
 * Get profile context
 */
async function getProfileContext(userId: string): Promise<UserProfile | null> {
  const profile = await db.queryOne<{
    id: string;
    auth_id: string;
    full_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    gender: string;
    language: string;
    timezone: string;
    personalization_data: Record<string, unknown>;
    created_at: Date;
  }>(
    `SELECT id, auth_id, full_name, email, phone, date_of_birth, gender,
            language, timezone, personalization_data, created_at
     FROM profiles WHERE auth_id = $1`,
    [userId]
  );

  if (!profile) return null;

  return {
    id: profile.id,
    authId: profile.auth_id,
    fullName: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    dateOfBirth: profile.date_of_birth,
    gender: profile.gender,
    language: profile.language || 'en',
    timezone: profile.timezone,
    occupation: profile.personalization_data?.occupation as string,
    createdAt: profile.created_at
  };
}

/**
 * Get preferences context
 */
async function getPreferencesContext(userId: string): Promise<UserPreferencesData> {
  const prefs = await getUserPreferences(userId);

  // Get onboarding answers
  const onboardingAnswers = await db.query<{ question_key: string; answer_data: { value: unknown } }>(
    `SELECT oq.question_key, uoa.answer_data
     FROM user_onboarding_answers uoa
     JOIN onboarding_questions oq ON uoa.question_id = oq.id
     JOIN profiles p ON p.id = uoa.profile_id
     WHERE p.auth_id = $1`,
    [userId]
  );

  const answers: Record<string, unknown> = {};
  for (const a of onboardingAnswers.rows) {
    answers[a.question_key] = a.answer_data?.value;
  }

  // Get personalization data
  const pd = await db.queryOne<{ personalization_data: Record<string, unknown> }>(
    `SELECT personalization_data FROM profiles WHERE auth_id = $1`,
    [userId]
  );

  return {
    ...prefs,
    onboardingAnswers: answers,
    personalizationData: pd?.personalization_data || {}
  };
}

/**
 * Get wellness context
 */
async function getWellnessContext(userId: string): Promise<WellnessContext> {
  const summary = await getWellnessSummary(userId, 'week');
  const entries = await getMoodEntries(userId, 14);

  const lastEntry = entries[0];

  return {
    averageMood: summary.averageMood,
    moodTrend: summary.moodTrend,
    streakDays: summary.streakDays,
    lastCheckIn: lastEntry?.createdAt,
    recentMoods: entries.slice(0, 5).map(e => ({
      date: e.createdAt,
      mood: e.mood,
      stress: e.stress
    })),
    commonEmotions: summary.commonEmotions.map(e => e.emotion),
    averageSleep: summary.averageSleep,
    stressDistribution: summary.stressDistribution
  };
}

/**
 * Get booking context
 */
async function getBookingContext(userId: string): Promise<BookingContext> {
  const stats = await db.queryOne<{
    total: number;
    completed: number;
    canceled: number;
    upcoming: number;
    last_booking: Date;
  }>(
    `SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COUNT(*) FILTER (WHERE status = 'canceled') as canceled,
      COUNT(*) FILTER (WHERE status = 'scheduled' AND start_time > NOW()) as upcoming,
      MAX(start_time) FILTER (WHERE status = 'completed') as last_booking
     FROM booking
     WHERE customer_reference_id = $1`,
    [userId]
  );

  // Get frequent services
  const services = await db.query<{ name: string; count: number }>(
    `SELECT s.name, COUNT(*) as count
     FROM booking b
     JOIN service s ON b.service_id = s.id
     WHERE b.customer_reference_id = $1
     GROUP BY s.name
     ORDER BY count DESC
     LIMIT 3`,
    [userId]
  );

  // Get preferred booking patterns
  const patterns = await db.queryOne<{ preferred_days: string[]; preferred_times: string[] }>(
    `SELECT
      ARRAY_AGG(DISTINCT TO_CHAR(start_time, 'Day')) as preferred_days,
      ARRAY_AGG(DISTINCT
        CASE
          WHEN EXTRACT(HOUR FROM start_time) < 12 THEN 'morning'
          WHEN EXTRACT(HOUR FROM start_time) < 17 THEN 'afternoon'
          ELSE 'evening'
        END
      ) as preferred_times
     FROM booking
     WHERE customer_reference_id = $1 AND start_time > NOW() - INTERVAL '90 days'`,
    [userId]
  );

  return {
    totalBookings: Number(stats?.total || 0),
    completedBookings: Number(stats?.completed || 0),
    canceledBookings: Number(stats?.canceled || 0),
    upcomingBookings: Number(stats?.upcoming || 0),
    lastBookingDate: stats?.last_booking,
    frequentServices: services.rows.map(s => s.name),
    preferredDays: (patterns?.preferred_days || []).filter(Boolean).map(d => d.trim()),
    preferredTimes: patterns?.preferred_times || []
  };
}

/**
 * Get financial context
 */
async function getFinancialContext(userId: string): Promise<FinancialContext> {
  const wallet = await db.queryOne<{ balance_cents: number }>(
    `SELECT balance_cents FROM user_wallet WHERE user_id = $1`,
    [userId]
  );

  const rewards = await db.queryOne<{ points_balance: number; tier: string }>(
    `SELECT points_balance, tier FROM user_rewards_balance WHERE user_id = $1`,
    [userId]
  );

  const spending = await db.queryOne<{ total: number; avg: number }>(
    `SELECT
      SUM(total_amount_cents) as total,
      AVG(total_amount_cents) as avg
     FROM booking
     WHERE customer_reference_id = $1 AND payment_status = 'captured'`,
    [userId]
  );

  return {
    walletBalance: (wallet?.balance_cents || 0) / 100,
    rewardsPoints: rewards?.points_balance || 0,
    rewardsTier: rewards?.tier || 'bronze',
    totalSpent: (Number(spending?.total) || 0) / 100,
    averageSpend: (Number(spending?.avg) || 0) / 100
  };
}

/**
 * Get interaction context
 */
async function getInteractionContext(userId: string): Promise<InteractionContext> {
  const stats = await db.queryOne<{
    total: number;
    last_interaction: Date;
    common_types: string[];
  }>(
    `SELECT
      COUNT(*) as total,
      MAX(created_at) as last_interaction,
      ARRAY_AGG(DISTINCT type) as common_types
     FROM ai_interactions
     WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 days'`,
    [userId]
  );

  const conversations = await db.queryOne<{ count: number; avg_messages: number }>(
    `SELECT
      COUNT(DISTINCT c.id) as count,
      AVG(message_count) as avg_messages
     FROM ai_conversations c
     LEFT JOIN (
       SELECT conversation_id, COUNT(*) as message_count
       FROM ai_messages
       GROUP BY conversation_id
     ) m ON c.id = m.conversation_id
     WHERE c.user_id = $1`,
    [userId]
  );

  return {
    totalInteractions: Number(stats?.total || 0),
    lastInteractionDate: stats?.last_interaction,
    commonInteractionTypes: stats?.common_types || [],
    conversationCount: Number(conversations?.count || 0),
    averageMessagesPerConversation: Number(conversations?.avg_messages || 0)
  };
}

/**
 * Get memories context
 */
async function getMemoriesContext(userId: string): Promise<MemoryContext> {
  const memories = await getRecentMemories(userId, 50);
  const important = await getImportantMemories(userId);

  const preferences = memories.filter(m => m.memoryType === 'preference').map(m => m.content);
  const goals = memories.filter(m => m.memoryType === 'goal').map(m => m.content);
  const facts = memories.filter(m => m.memoryType === 'fact').map(m => m.content);
  const observations = memories.filter(m => m.memoryType === 'observation').slice(0, 5).map(m => m.content);

  return {
    totalMemories: memories.length,
    preferences: preferences.slice(0, 10),
    goals: goals.slice(0, 5),
    facts: facts.slice(0, 10),
    recentObservations: observations,
    importantItems: important.slice(0, 10).map(m => m.content)
  };
}

/**
 * Get insights context
 */
async function getInsightsContext(userId: string): Promise<InsightContext> {
  const insights = await getActiveInsights(userId);
  const profile = await getAIUserProfile(userId);

  const pendingActions: string[] = [];
  for (const insight of insights) {
    for (const action of insight.actionItems || []) {
      if (!action.completed) {
        pendingActions.push(action.title);
      }
    }
  }

  return {
    activeInsights: insights.slice(0, 5).map(i => ({
      title: i.title,
      type: i.type,
      priority: i.priority
    })),
    pendingActions: pendingActions.slice(0, 5),
    wellnessScore: (profile?.wellnessInsights as any)?.score || 50
  };
}

/**
 * Compute derived context
 */
function computeDerivedContext(
  profile: UserProfile,
  preferences: UserPreferencesData,
  wellness: WellnessContext,
  booking: BookingContext,
  interactions: InteractionContext
): ComputedContext {
  // Determine user type
  let userType: ComputedContext['userType'] = 'new';
  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceCreation < 7 && booking.totalBookings === 0) {
    userType = 'new';
  } else if (booking.completedBookings >= 5 && interactions.totalInteractions >= 20) {
    userType = 'engaged';
  } else if (booking.completedBookings >= 1 && wellness.moodTrend === 'declining') {
    userType = 'at_risk';
  } else if (booking.lastBookingDate) {
    const daysSinceLastBooking = Math.floor(
      (Date.now() - new Date(booking.lastBookingDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    userType = daysSinceLastBooking > 30 ? 'returning' : 'active';
  }

  // Determine engagement level
  let engagementLevel: ComputedContext['engagementLevel'] = 'low';
  if (interactions.totalInteractions >= 15 && wellness.streakDays >= 5) {
    engagementLevel = 'high';
  } else if (interactions.totalInteractions >= 5 || wellness.streakDays >= 2) {
    engagementLevel = 'medium';
  }

  // Determine next best action
  let nextBestAction = 'Complete your profile';
  if (booking.totalBookings === 0) {
    nextBestAction = 'Book your first wellness session';
  } else if (wellness.streakDays === 0 && !wellness.lastCheckIn) {
    nextBestAction = 'Log your first mood check-in';
  } else if (booking.upcomingBookings === 0 && booking.completedBookings >= 1) {
    nextBestAction = 'Schedule your next session';
  } else if (wellness.moodTrend === 'declining') {
    nextBestAction = 'Explore stress relief techniques';
  } else if (preferences.goals.length === 0) {
    nextBestAction = 'Set your wellness goals';
  }

  // Generate personalized greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name = profile.fullName?.split(' ')[0] || '';
  let personalizedGreeting = `${timeGreeting}${name ? `, ${name}` : ''}!`;

  if (wellness.streakDays >= 7) {
    personalizedGreeting += ` ${wellness.streakDays} day streak - amazing!`;
  } else if (wellness.moodTrend === 'improving') {
    personalizedGreeting += ' Your wellness is trending up!';
  } else if (userType === 'new') {
    personalizedGreeting += ' Welcome to EKA Balance!';
  }

  // Suggest topics based on context
  const suggestedTopics: string[] = [];
  if (wellness.moodTrend === 'declining') {
    suggestedTopics.push('stress management', 'self-care tips');
  }
  if (preferences.stressLevel >= 7) {
    suggestedTopics.push('relaxation techniques', 'breathing exercises');
  }
  for (const goal of preferences.goals.slice(0, 2)) {
    suggestedTopics.push(goal.toLowerCase());
  }
  if (booking.upcomingBookings > 0) {
    suggestedTopics.push('upcoming appointments');
  }

  return {
    userType,
    engagementLevel,
    nextBestAction,
    personalizedGreeting,
    suggestedTopics: suggestedTopics.slice(0, 4)
  };
}

/**
 * Format user context as natural language for AI prompt
 */
export function formatContextForAI(context: UserContext): string {
  const lines: string[] = [];

  // User profile
  lines.push('## User Profile');
  if (context.profile.fullName) lines.push(`- Name: ${context.profile.fullName}`);
  lines.push(`- User type: ${context.computed.userType}`);
  lines.push(`- Engagement level: ${context.computed.engagementLevel}`);
  if (context.profile.language !== 'en') lines.push(`- Preferred language: ${context.profile.language}`);

  // Goals and preferences
  if (context.preferences.goals.length > 0) {
    lines.push('\n## Goals & Preferences');
    lines.push(`- Goals: ${context.preferences.goals.join(', ')}`);
    if (context.preferences.focusAreas.length > 0) {
      lines.push(`- Focus areas: ${context.preferences.focusAreas.join(', ')}`);
    }
    if (context.preferences.communicationStyle) {
      lines.push(`- Prefers ${context.preferences.communicationStyle} communication`);
    }
  }

  // Wellness status
  lines.push('\n## Current Wellness Status');
  lines.push(`- Average mood (last week): ${context.wellness.averageMood}/10`);
  lines.push(`- Mood trend: ${context.wellness.moodTrend}`);
  lines.push(`- Average sleep: ${context.wellness.averageSleep} hours`);
  if (context.wellness.streakDays > 0) {
    lines.push(`- Check-in streak: ${context.wellness.streakDays} days`);
  }
  if (context.wellness.commonEmotions.length > 0) {
    lines.push(`- Common emotions: ${context.wellness.commonEmotions.slice(0, 3).join(', ')}`);
  }

  // Booking history
  lines.push('\n## Booking History');
  lines.push(`- Total bookings: ${context.booking.totalBookings}`);
  lines.push(`- Completed: ${context.booking.completedBookings}`);
  if (context.booking.upcomingBookings > 0) {
    lines.push(`- Upcoming: ${context.booking.upcomingBookings}`);
  }
  if (context.booking.frequentServices.length > 0) {
    lines.push(`- Favorite services: ${context.booking.frequentServices.join(', ')}`);
  }

  // Financial
  if (context.financial.walletBalance > 0 || context.financial.rewardsPoints > 0) {
    lines.push('\n## Account Status');
    if (context.financial.walletBalance > 0) {
      lines.push(`- Wallet balance: $${context.financial.walletBalance.toFixed(2)}`);
    }
    if (context.financial.rewardsPoints > 0) {
      lines.push(`- Rewards: ${context.financial.rewardsPoints} points (${context.financial.rewardsTier})`);
    }
  }

  // Memories (important user information)
  if (context.memories.totalMemories > 0) {
    lines.push('\n## Remembered Information');
    if (context.memories.preferences.length > 0) {
      lines.push('User preferences:');
      for (const pref of context.memories.preferences.slice(0, 5)) {
        lines.push(`  - ${pref}`);
      }
    }
    if (context.memories.goals.length > 0) {
      lines.push('User-stated goals:');
      for (const goal of context.memories.goals.slice(0, 3)) {
        lines.push(`  - ${goal}`);
      }
    }
    if (context.memories.importantItems.length > 0) {
      lines.push('Important notes:');
      for (const item of context.memories.importantItems.slice(0, 5)) {
        lines.push(`  - ${item}`);
      }
    }
  }

  // Active insights
  if (context.insights.activeInsights.length > 0) {
    lines.push('\n## Active Insights');
    for (const insight of context.insights.activeInsights.slice(0, 3)) {
      lines.push(`- [${insight.priority}] ${insight.title}`);
    }
  }

  // Suggested actions
  lines.push('\n## Suggested Next Action');
  lines.push(`- ${context.computed.nextBestAction}`);

  if (context.computed.suggestedTopics.length > 0) {
    lines.push(`- Relevant topics: ${context.computed.suggestedTopics.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Extract and store learnings from conversation
 */
export async function extractAndStoreLearnings(
  userId: string,
  userMessage: string,
  assistantResponse: string,
  toolResults?: Record<string, unknown>
): Promise<void> {
  try {
    const lowerMessage = userMessage.toLowerCase();

    // Extract preferences
    const preferencePatterns = [
      /i (prefer|like|want|love|enjoy) (.+)/i,
      /my (favorite|preferred) (.+) is (.+)/i,
      /i (don't|do not|hate|dislike) (.+)/i,
    ];

    for (const pattern of preferencePatterns) {
      const match = userMessage.match(pattern);
      if (match) {
        await db.query(
          `INSERT INTO user_memory (user_id, content, memory_type, importance, metadata)
           VALUES ($1, $2, 'preference', 4, $3)`,
          [userId, userMessage, { extractedAt: new Date().toISOString(), source: 'conversation' }]
        );
        break;
      }
    }

    // Extract goals
    const goalPatterns = [
      /i want to (.+)/i,
      /my goal is (.+)/i,
      /i('m| am) trying to (.+)/i,
      /i need help with (.+)/i,
      /i('m| am) working on (.+)/i,
    ];

    for (const pattern of goalPatterns) {
      const match = userMessage.match(pattern);
      if (match) {
        await db.query(
          `INSERT INTO user_memory (user_id, content, memory_type, importance, metadata)
           VALUES ($1, $2, 'goal', 5, $3)`,
          [userId, userMessage, { extractedAt: new Date().toISOString(), source: 'conversation' }]
        );
        break;
      }
    }

    // Extract facts
    const factPatterns = [
      /i (am|have|work|live|study) (.+)/i,
      /my (name|job|occupation|age) is (.+)/i,
      /i('ve| have) been (.+)/i,
    ];

    for (const pattern of factPatterns) {
      const match = userMessage.match(pattern);
      if (match) {
        await db.query(
          `INSERT INTO user_memory (user_id, content, memory_type, importance, metadata)
           VALUES ($1, $2, 'fact', 3, $3)`,
          [userId, userMessage, { extractedAt: new Date().toISOString(), source: 'conversation' }]
        );
        break;
      }
    }

    // Extract mood indicators
    const moodKeywords = [
      'feeling', 'stressed', 'anxious', 'happy', 'sad', 'tired',
      'excited', 'overwhelmed', 'worried', 'calm', 'peaceful',
      'frustrated', 'angry', 'depressed', 'hopeful'
    ];

    if (moodKeywords.some(kw => lowerMessage.includes(kw))) {
      await db.query(
        `INSERT INTO user_memory (user_id, content, memory_type, importance, metadata)
         VALUES ($1, $2, 'mood', 3, $3)`,
        [userId, userMessage, { extractedAt: new Date().toISOString(), source: 'conversation' }]
      );
    }

    // Store significant interactions
    if (userMessage.length > 100) {
      await db.query(
        `INSERT INTO user_memory (user_id, content, memory_type, importance, metadata)
         VALUES ($1, $2, 'interaction', 2, $3)`,
        [userId, userMessage.substring(0, 500), { extractedAt: new Date().toISOString(), hasResponse: true }]
      );
    }

    // Log the interaction for analytics
    await db.query(
      `INSERT INTO ai_interactions (user_id, type, context, metadata)
       VALUES ($1, $2, $3, $4)`,
      [userId, 'chat_message', { messageLength: userMessage.length }, { timestamp: new Date().toISOString() }]
    );
  } catch (error) {
    console.error('Error extracting learnings:', error);
  }
}

/**
 * Update AI user profile with behavioral patterns
 */
export async function updateUserBehaviorPatterns(userId: string): Promise<void> {
  try {
    // Analyze recent interactions
    const recentInteractions = await db.query<{ type: string; count: number }>(
      `SELECT type, COUNT(*) as count
       FROM ai_interactions
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '7 days'
       GROUP BY type
       ORDER BY count DESC`,
      [userId]
    );

    // Calculate patterns
    const patterns = {
      interactionFrequency: recentInteractions.rows.reduce((sum, r) => sum + Number(r.count), 0) / 7,
      preferredInteractionTypes: recentInteractions.rows.slice(0, 3).map(r => r.type),
      lastUpdated: new Date().toISOString()
    };

    // Update profile
    await db.query(
      `INSERT INTO ai_user_profiles (user_id, behavior_patterns, preferences, wellness_insights, adaptive_settings)
       VALUES ($1, $2, '{}', '{}', '{}')
       ON CONFLICT (user_id) DO UPDATE SET
         behavior_patterns = $2,
         last_updated = NOW()`,
      [userId, JSON.stringify([patterns])]
    );
  } catch (error) {
    console.error('Error updating behavior patterns:', error);
  }
}
