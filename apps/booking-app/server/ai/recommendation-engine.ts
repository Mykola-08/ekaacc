/**
 * AI Recommendation Engine
 * Generates personalized recommendations for services, exercises, and content
 *
 * @review - Basic rule-based engine, needs ML model integration for production
 */
import { db } from '@/lib/db';
import { getWellnessSummary } from './wellness-service';
import { getRecentMemories } from './ai-memory-service';
import { getActiveInsights } from './ai-insights-service';

export type RecommendationType = 'service' | 'exercise' | 'article' | 'therapist' | 'action' | 'goal';
export type RecommendationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  reason: string;
  priority: RecommendationPriority;
  confidence: number; // 0-1
  data: Record<string, unknown>;
  actionUrl?: string;
  expiresAt?: Date;
}

export interface ServiceRecommendation extends Recommendation {
  type: 'service';
  data: {
    serviceId: string;
    serviceName: string;
    price?: number;
    duration?: number;
    matchScore: number;
  };
}

export interface ExerciseRecommendation extends Recommendation {
  type: 'exercise';
  data: {
    exerciseId: string;
    exerciseName: string;
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
  };
}

export interface UserPreferences {
  goals: string[];
  concerns: string[];
  preferredDuration: number;
  preferredTherapistGender?: string;
  focusAreas: string[];
  stressLevel: number;
  activityLevel: string;
}

/**
 * Get user preferences from various sources
 */
export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  const defaultPrefs: UserPreferences = {
    goals: [],
    concerns: [],
    preferredDuration: 60,
    focusAreas: [],
    stressLevel: 5,
    activityLevel: 'moderate'
  };

  try {
    // Get from user_preferences table
    const prefs = await db.queryOne<{
      goals: string[];
      concerns: string[];
      preferred_session_duration: number;
      preferred_therapist_gender: string;
    }>(
      `SELECT goals, concerns, preferred_session_duration, preferred_therapist_gender
       FROM user_preferences
       WHERE user_id = $1`,
      [userId]
    );

    if (prefs) {
      defaultPrefs.goals = prefs.goals || [];
      defaultPrefs.concerns = prefs.concerns || [];
      defaultPrefs.preferredDuration = prefs.preferred_session_duration || 60;
      defaultPrefs.preferredTherapistGender = prefs.preferred_therapist_gender;
    }

    // Get from onboarding answers
    const onboardingAnswers = await db.query<{ question_key: string; answer_data: { value: unknown } }>(
      `SELECT oq.question_key, uoa.answer_data
       FROM user_onboarding_answers uoa
       JOIN onboarding_questions oq ON uoa.question_id = oq.id
       JOIN profiles p ON p.id = uoa.profile_id
       WHERE p.auth_id = $1`,
      [userId]
    );

    for (const answer of onboardingAnswers.rows) {
      switch (answer.question_key) {
        case 'primary_goal':
          if (answer.answer_data?.value) {
            defaultPrefs.goals.push(String(answer.answer_data.value));
          }
          break;
        case 'stress_level':
          defaultPrefs.stressLevel = Number(answer.answer_data?.value) || 5;
          break;
        case 'focus_areas':
          if (Array.isArray(answer.answer_data?.value)) {
            defaultPrefs.focusAreas = answer.answer_data.value as string[];
          }
          break;
      }
    }

    // Get recent memories to understand current state
    const memories = await getRecentMemories(userId, 10, ['preference', 'goal']);
    for (const memory of memories) {
      // Extract goals from memories
      const content = memory.content.toLowerCase();
      if (content.includes('stress') || content.includes('relax')) {
        if (!defaultPrefs.goals.includes('Stress Relief')) {
          defaultPrefs.goals.push('Stress Relief');
        }
      }
      if (content.includes('sleep')) {
        if (!defaultPrefs.goals.includes('Better Sleep')) {
          defaultPrefs.goals.push('Better Sleep');
        }
      }
    }

    return defaultPrefs;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return defaultPrefs;
  }
}

/**
 * Generate service recommendations based on user profile
 */
export async function generateServiceRecommendations(
  userId: string,
  limit: number = 5
): Promise<ServiceRecommendation[]> {
  try {
    const preferences = await getUserPreferences(userId);
    const wellness = await getWellnessSummary(userId, 'week');

    // Fetch all active services
    const { rows: services } = await db.query<{
      id: string;
      name: string;
      description: string;
      price_amount: number;
      duration_min: number;
      category: string;
    }>(
      `SELECT id, name, description, price_amount, duration_min, category
       FROM service
       WHERE active = true
       ORDER BY name`
    );

    // Score each service based on user preferences
    const scoredServices = services.map(service => {
      let score = 0.5; // Base score
      const reasons: string[] = [];

      // Match goals
      for (const goal of preferences.goals) {
        const goalLower = goal.toLowerCase();
        const nameLower = service.name.toLowerCase();
        const descLower = (service.description || '').toLowerCase();

        if (nameLower.includes(goalLower) || descLower.includes(goalLower)) {
          score += 0.2;
          reasons.push(`Matches your goal: ${goal}`);
        }

        // Special matching rules
        if (goalLower.includes('stress') && (nameLower.includes('relax') || nameLower.includes('massage'))) {
          score += 0.15;
          reasons.push('Good for stress relief');
        }
        if (goalLower.includes('pain') && (nameLower.includes('therapy') || nameLower.includes('physical'))) {
          score += 0.15;
          reasons.push('Helps with pain management');
        }
      }

      // Match focus areas
      for (const area of preferences.focusAreas) {
        if ((service.description || '').toLowerCase().includes(area.toLowerCase())) {
          score += 0.1;
          reasons.push(`Targets your focus area: ${area}`);
        }
      }

      // Consider stress level
      if (preferences.stressLevel >= 7 && service.name.toLowerCase().includes('relax')) {
        score += 0.15;
        reasons.push('Recommended for high stress');
      }

      // Consider wellness trend
      if (wellness.moodTrend === 'declining' && service.category === 'therapy') {
        score += 0.1;
        reasons.push('May help improve your mood');
      }

      // Duration preference
      if (service.duration_min === preferences.preferredDuration) {
        score += 0.05;
      }

      return {
        service,
        score: Math.min(1, score),
        reasons
      };
    });

    // Sort by score and take top results
    scoredServices.sort((a, b) => b.score - a.score);

    return scoredServices.slice(0, limit).map((item, index) => ({
      id: `rec-service-${item.service.id}`,
      type: 'service' as const,
      title: item.service.name,
      description: item.service.description || '',
      reason: item.reasons[0] || 'Recommended for you',
      priority: item.score >= 0.8 ? 'high' : item.score >= 0.6 ? 'medium' : 'low',
      confidence: item.score,
      data: {
        serviceId: item.service.id,
        serviceName: item.service.name,
        price: item.service.price_amount,
        duration: item.service.duration_min,
        matchScore: Math.round(item.score * 100)
      },
      actionUrl: `/services/${item.service.id}`
    }));
  } catch (error) {
    console.error('Error generating service recommendations:', error);
    return [];
  }
}

/**
 * Generate exercise recommendations
 */
export async function generateExerciseRecommendations(
  userId: string,
  limit: number = 3
): Promise<ExerciseRecommendation[]> {
  const recommendations: ExerciseRecommendation[] = [];

  try {
    const preferences = await getUserPreferences(userId);
    const wellness = await getWellnessSummary(userId, 'week');

    // Define exercise library (could be from DB)
    const exercises = [
      { id: 'breathing-1', name: 'Deep Breathing', duration: 5, difficulty: 'beginner' as const, category: 'breathing', forStress: true },
      { id: 'breathing-2', name: 'Box Breathing', duration: 10, difficulty: 'beginner' as const, category: 'breathing', forStress: true },
      { id: 'meditation-1', name: 'Guided Meditation', duration: 10, difficulty: 'beginner' as const, category: 'meditation', forMood: true },
      { id: 'meditation-2', name: 'Body Scan Meditation', duration: 15, difficulty: 'intermediate' as const, category: 'meditation', forSleep: true },
      { id: 'stretch-1', name: 'Morning Stretch Routine', duration: 10, difficulty: 'beginner' as const, category: 'movement', forEnergy: true },
      { id: 'stretch-2', name: 'Desk Break Stretches', duration: 5, difficulty: 'beginner' as const, category: 'movement', forPain: true },
      { id: 'mindfulness-1', name: 'Gratitude Practice', duration: 5, difficulty: 'beginner' as const, category: 'mindfulness', forMood: true },
      { id: 'mindfulness-2', name: 'Mindful Walking', duration: 15, difficulty: 'beginner' as const, category: 'mindfulness', forStress: true },
      { id: 'sleep-1', name: 'Sleep Preparation Routine', duration: 20, difficulty: 'beginner' as const, category: 'sleep', forSleep: true },
      { id: 'focus-1', name: 'Concentration Exercise', duration: 10, difficulty: 'intermediate' as const, category: 'focus', forFocus: true }
    ];

    // Score exercises based on user needs
    const scoredExercises = exercises.map(exercise => {
      let score = 0.3;
      let reason = 'Recommended exercise';

      // High stress
      if (preferences.stressLevel >= 7 && exercise.forStress) {
        score += 0.4;
        reason = 'Great for managing stress';
      }

      // Low mood
      if (wellness.averageMood < 5 && exercise.forMood) {
        score += 0.3;
        reason = 'May help improve your mood';
      }

      // Sleep issues
      if (wellness.averageSleep < 6 && exercise.forSleep) {
        score += 0.35;
        reason = 'Recommended for better sleep';
      }

      // Goals matching
      for (const goal of preferences.goals) {
        const goalLower = goal.toLowerCase();
        if (goalLower.includes('stress') && exercise.forStress) {
          score += 0.2;
          reason = 'Aligns with your stress relief goals';
        }
        if (goalLower.includes('sleep') && exercise.forSleep) {
          score += 0.2;
          reason = 'Supports your sleep improvement goal';
        }
        if (goalLower.includes('pain') && exercise.forPain) {
          score += 0.2;
          reason = 'May help with pain management';
        }
      }

      return { exercise, score: Math.min(1, score), reason };
    });

    // Sort and take top
    scoredExercises.sort((a, b) => b.score - a.score);

    for (const item of scoredExercises.slice(0, limit)) {
      recommendations.push({
        id: `rec-exercise-${item.exercise.id}`,
        type: 'exercise',
        title: item.exercise.name,
        description: `${item.exercise.duration} minute ${item.exercise.category} exercise`,
        reason: item.reason,
        priority: item.score >= 0.7 ? 'high' : 'medium',
        confidence: item.score,
        data: {
          exerciseId: item.exercise.id,
          exerciseName: item.exercise.name,
          duration: item.exercise.duration,
          difficulty: item.exercise.difficulty,
          category: item.exercise.category
        },
        actionUrl: `/exercises/${item.exercise.id}`
      });
    }

    return recommendations;
  } catch (error) {
    console.error('Error generating exercise recommendations:', error);
    return recommendations;
  }
}

/**
 * Generate action recommendations (next steps)
 */
export async function generateActionRecommendations(userId: string): Promise<Recommendation[]> {
  const actions: Recommendation[] = [];

  try {
    const preferences = await getUserPreferences(userId);
    const insights = await getActiveInsights(userId);

    // Check for incomplete action items from insights
    for (const insight of insights) {
      const incompleteActions = (insight.actionItems || []).filter(a => !a.completed);
      for (const action of incompleteActions.slice(0, 2)) {
        actions.push({
          id: `rec-action-${insight.id}-${action.id}`,
          type: 'action',
          title: action.title,
          description: action.description || 'Suggested action based on your insights',
          reason: `From insight: ${insight.title}`,
          priority: insight.priority,
          confidence: insight.confidence,
          data: { insightId: insight.id, actionId: action.id }
        });
      }
    }

    // Check for booking suggestions
    const recentBooking = await db.queryOne<{ last_booking: Date }>(
      `SELECT MAX(start_time) as last_booking
       FROM booking
       WHERE customer_reference_id = $1 AND status = 'completed'`,
      [userId]
    );

    if (recentBooking?.last_booking) {
      const daysSinceLastBooking = Math.floor(
        (Date.now() - new Date(recentBooking.last_booking).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastBooking > 14) {
        actions.push({
          id: 'rec-action-book-session',
          type: 'action',
          title: 'Schedule Your Next Session',
          description: `It's been ${daysSinceLastBooking} days since your last session. Staying consistent helps your wellness journey.`,
          reason: 'Based on your booking history',
          priority: daysSinceLastBooking > 30 ? 'high' : 'medium',
          confidence: 0.8,
          data: { daysSinceLastBooking },
          actionUrl: '/book'
        });
      }
    } else {
      // No completed bookings - suggest first booking
      actions.push({
        id: 'rec-action-first-booking',
        type: 'action',
        title: 'Book Your First Session',
        description: 'Start your wellness journey by booking your first session with one of our therapists.',
        reason: 'New user recommendation',
        priority: 'high',
        confidence: 0.9,
        data: {},
        actionUrl: '/book'
      });
    }

    // Check goals
    if (preferences.goals.length === 0) {
      actions.push({
        id: 'rec-action-set-goals',
        type: 'action',
        title: 'Set Your Wellness Goals',
        description: 'Setting clear goals helps us personalize your experience and track your progress.',
        reason: 'Personalization suggestion',
        priority: 'medium',
        confidence: 0.85,
        data: {},
        actionUrl: '/settings/goals'
      });
    }

    return actions.slice(0, 5);
  } catch (error) {
    console.error('Error generating action recommendations:', error);
    return actions;
  }
}

/**
 * Get all recommendations for a user
 */
export async function getAllRecommendations(userId: string): Promise<{
  services: ServiceRecommendation[];
  exercises: ExerciseRecommendation[];
  actions: Recommendation[];
}> {
  const [services, exercises, actions] = await Promise.all([
    generateServiceRecommendations(userId, 5),
    generateExerciseRecommendations(userId, 3),
    generateActionRecommendations(userId)
  ]);

  return { services, exercises, actions };
}

/**
 * Log recommendation interaction (for learning)
 */
export async function logRecommendationInteraction(
  userId: string,
  recommendationId: string,
  action: 'viewed' | 'clicked' | 'dismissed' | 'completed'
): Promise<void> {
  try {
    await db.query(
      `INSERT INTO recommendation_interactions (user_id, recommendation_id, action, metadata)
       VALUES ($1, $2, $3, $4)`,
      [userId, recommendationId, action, { timestamp: new Date().toISOString() }]
    );
  } catch (error) {
    console.error('Error logging recommendation interaction:', error);
  }
}

/**
 * Get recommendation history
 */
export async function getRecommendationHistory(
  userId: string,
  days: number = 30
): Promise<{ id: string; type: string; action: string; createdAt: Date }[]> {
  try {
    const { rows } = await db.query<{ id: string; recommendation_id: string; action: string; created_at: Date }>(
      `SELECT id, recommendation_id, action, created_at
       FROM recommendation_interactions
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '${days} days'
       ORDER BY created_at DESC
       LIMIT 100`,
      [userId]
    );
    return rows.map(r => ({
      id: r.id,
      type: r.recommendation_id,
      action: r.action,
      createdAt: r.created_at
    }));
  } catch (error) {
    console.error('Error fetching recommendation history:', error);
    return [];
  }
}
