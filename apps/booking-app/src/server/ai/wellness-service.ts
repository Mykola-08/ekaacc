/**
 * Wellness Tracking Service
 * Handles mood tracking, wellness metrics, and health-related AI features
 *
 * @review - Basic design, needs better data visualization support
 */
import { db } from '@/lib/db';

export type MoodLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type EnergyLevel = 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
export type StressLevel = 'minimal' | 'mild' | 'moderate' | 'high' | 'severe';

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodLevel;
  energy: EnergyLevel;
  stress: StressLevel;
  notes?: string;
  activities: string[];
  emotions: string[];
  sleepQuality?: number; // 1-5
  sleepHours?: number;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface WellnessSummary {
  period: 'day' | 'week' | 'month';
  averageMood: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  commonEmotions: { emotion: string; count: number }[];
  commonActivities: { activity: string; count: number }[];
  averageSleep: number;
  stressDistribution: Record<StressLevel, number>;
  totalEntries: number;
  streakDays: number;
}

export interface WellnessGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetType: 'mood' | 'stress' | 'sleep' | 'activity' | 'custom';
  targetValue: number;
  currentValue: number;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  progress: number; // 0-100
  createdAt: Date;
}

export interface DailyCheckIn {
  mood: MoodLevel;
  energy: EnergyLevel;
  stress: StressLevel;
  sleepQuality?: number;
  sleepHours?: number;
  notes?: string;
  activities?: string[];
  emotions?: string[];
}

// Predefined options for UI
export const EMOTIONS = [
  'happy', 'calm', 'grateful', 'hopeful', 'confident',
  'anxious', 'sad', 'frustrated', 'overwhelmed', 'tired',
  'angry', 'lonely', 'confused', 'motivated', 'peaceful'
] as const;

export const ACTIVITIES = [
  'exercise', 'meditation', 'therapy', 'socializing', 'work',
  'hobby', 'rest', 'outdoors', 'creative', 'learning',
  'family', 'self-care', 'travel', 'volunteering', 'reading'
] as const;

/**
 * Create a new mood/wellness entry
 */
export async function createMoodEntry(
  userId: string,
  data: DailyCheckIn
): Promise<MoodEntry | null> {
  try {
    const result = await db.queryOne<MoodEntry>(
      `INSERT INTO wellness_entries
        (user_id, mood, energy, stress, sleep_quality, sleep_hours, notes, activities, emotions, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, user_id as "userId", mood, energy, stress,
                 sleep_quality as "sleepQuality", sleep_hours as "sleepHours",
                 notes, activities, emotions, metadata, created_at as "createdAt"`,
      [
        userId,
        data.mood,
        data.energy,
        data.stress,
        data.sleepQuality || null,
        data.sleepHours || null,
        data.notes || null,
        data.activities || [],
        data.emotions || [],
        { source: 'app', timestamp: new Date().toISOString() }
      ]
    );

    // Also create a memory entry for AI context
    if (result) {
      const memoryContent = `Mood check-in: ${data.mood}/10, Energy: ${data.energy}, Stress: ${data.stress}${data.notes ? `. Notes: ${data.notes}` : ''}`;
      await db.query(
        `INSERT INTO user_memory (user_id, content, memory_type, importance, metadata)
         VALUES ($1, $2, 'mood', 3, $3)`,
        [userId, memoryContent, { mood: data.mood, entryId: result.id }]
      );
    }

    return result;
  } catch (error) {
    console.error('Error creating mood entry:', error);
    return null;
  }
}

/**
 * Get recent mood entries for a user
 */
export async function getMoodEntries(
  userId: string,
  days: number = 30
): Promise<MoodEntry[]> {
  try {
    const { rows } = await db.query<MoodEntry>(
      `SELECT id, user_id as "userId", mood, energy, stress,
              sleep_quality as "sleepQuality", sleep_hours as "sleepHours",
              notes, activities, emotions, metadata, created_at as "createdAt"
       FROM wellness_entries
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '${days} days'
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    return [];
  }
}

/**
 * Get today's mood entry if exists
 */
export async function getTodaysMoodEntry(userId: string): Promise<MoodEntry | null> {
  try {
    return await db.queryOne<MoodEntry>(
      `SELECT id, user_id as "userId", mood, energy, stress,
              sleep_quality as "sleepQuality", sleep_hours as "sleepHours",
              notes, activities, emotions, metadata, created_at as "createdAt"
       FROM wellness_entries
       WHERE user_id = $1 AND created_at::date = CURRENT_DATE
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );
  } catch (error) {
    console.error('Error fetching today\'s entry:', error);
    return null;
  }
}

/**
 * Calculate wellness summary for a period
 */
export async function getWellnessSummary(
  userId: string,
  period: 'day' | 'week' | 'month' = 'week'
): Promise<WellnessSummary> {
  const intervalMap = {
    day: '1 day',
    week: '7 days',
    month: '30 days'
  };

  try {
    // Get basic stats
    const stats = await db.queryOne<{
      avg_mood: number;
      avg_sleep: number;
      total: number;
      recent_avg: number;
      older_avg: number;
    }>(
      `SELECT
        AVG(mood) as avg_mood,
        AVG(sleep_hours) as avg_sleep,
        COUNT(*) as total,
        AVG(mood) FILTER (WHERE created_at > NOW() - INTERVAL '${intervalMap[period]}' / 2) as recent_avg,
        AVG(mood) FILTER (WHERE created_at <= NOW() - INTERVAL '${intervalMap[period]}' / 2) as older_avg
       FROM wellness_entries
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '${intervalMap[period]}'`,
      [userId]
    );

    // Get emotion counts
    const emotionStats = await db.query<{ emotion: string; count: number }>(
      `SELECT unnest(emotions) as emotion, COUNT(*) as count
       FROM wellness_entries
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '${intervalMap[period]}'
       GROUP BY emotion
       ORDER BY count DESC
       LIMIT 5`,
      [userId]
    );

    // Get activity counts
    const activityStats = await db.query<{ activity: string; count: number }>(
      `SELECT unnest(activities) as activity, COUNT(*) as count
       FROM wellness_entries
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '${intervalMap[period]}'
       GROUP BY activity
       ORDER BY count DESC
       LIMIT 5`,
      [userId]
    );

    // Get stress distribution
    const stressStats = await db.query<{ stress: StressLevel; count: number }>(
      `SELECT stress, COUNT(*) as count
       FROM wellness_entries
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '${intervalMap[period]}'
       GROUP BY stress`,
      [userId]
    );

    // Calculate streak
    const streakResult = await db.queryOne<{ streak: number }>(
      `WITH daily_entries AS (
        SELECT created_at::date as entry_date
        FROM wellness_entries
        WHERE user_id = $1
        GROUP BY created_at::date
      ),
      streak_calc AS (
        SELECT entry_date,
               entry_date - (ROW_NUMBER() OVER (ORDER BY entry_date))::int AS grp
        FROM daily_entries
        WHERE entry_date >= CURRENT_DATE - INTERVAL '30 days'
      )
      SELECT COUNT(*) as streak
      FROM streak_calc
      WHERE grp = (SELECT grp FROM streak_calc WHERE entry_date = CURRENT_DATE LIMIT 1)`,
      [userId]
    );

    // Determine trend
    let trend: WellnessSummary['moodTrend'] = 'stable';
    if (stats?.recent_avg && stats?.older_avg) {
      if (stats.recent_avg > stats.older_avg * 1.1) {
        trend = 'improving';
      } else if (stats.recent_avg < stats.older_avg * 0.9) {
        trend = 'declining';
      }
    }

    // Build stress distribution object
    const stressDistribution: Record<StressLevel, number> = {
      minimal: 0,
      mild: 0,
      moderate: 0,
      high: 0,
      severe: 0
    };
    for (const s of stressStats.rows) {
      stressDistribution[s.stress] = Number(s.count);
    }

    return {
      period,
      averageMood: Math.round((stats?.avg_mood || 5) * 10) / 10,
      moodTrend: trend,
      commonEmotions: emotionStats.rows.map(e => ({ emotion: e.emotion, count: Number(e.count) })),
      commonActivities: activityStats.rows.map(a => ({ activity: a.activity, count: Number(a.count) })),
      averageSleep: Math.round((stats?.avg_sleep || 7) * 10) / 10,
      stressDistribution,
      totalEntries: Number(stats?.total || 0),
      streakDays: Number(streakResult?.streak || 0)
    };
  } catch (error) {
    console.error('Error calculating wellness summary:', error);
    return {
      period,
      averageMood: 5,
      moodTrend: 'stable',
      commonEmotions: [],
      commonActivities: [],
      averageSleep: 7,
      stressDistribution: { minimal: 0, mild: 0, moderate: 0, high: 0, severe: 0 },
      totalEntries: 0,
      streakDays: 0
    };
  }
}

/**
 * Create a wellness goal
 */
export async function createWellnessGoal(
  userId: string,
  title: string,
  targetType: WellnessGoal['targetType'],
  targetValue: number,
  description?: string,
  endDate?: Date
): Promise<WellnessGoal | null> {
  try {
    const result = await db.queryOne<WellnessGoal>(
      `INSERT INTO wellness_goals
        (user_id, title, description, target_type, target_value, current_value, end_date)
       VALUES ($1, $2, $3, $4, $5, 0, $6)
       RETURNING id, user_id as "userId", title, description,
                 target_type as "targetType", target_value as "targetValue",
                 current_value as "currentValue", start_date as "startDate",
                 end_date as "endDate", status, progress, created_at as "createdAt"`,
      [userId, title, description || null, targetType, targetValue, endDate || null]
    );
    return result;
  } catch (error) {
    console.error('Error creating wellness goal:', error);
    return null;
  }
}

/**
 * Get active wellness goals
 */
export async function getActiveGoals(userId: string): Promise<WellnessGoal[]> {
  try {
    const { rows } = await db.query<WellnessGoal>(
      `SELECT id, user_id as "userId", title, description,
              target_type as "targetType", target_value as "targetValue",
              current_value as "currentValue", start_date as "startDate",
              end_date as "endDate", status, progress, created_at as "createdAt"
       FROM wellness_goals
       WHERE user_id = $1 AND status = 'active'
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
}

/**
 * Update goal progress
 */
export async function updateGoalProgress(
  goalId: string,
  userId: string,
  currentValue: number
): Promise<boolean> {
  try {
    const goal = await db.queryOne<{ target_value: number }>(
      `SELECT target_value FROM wellness_goals WHERE id = $1 AND user_id = $2`,
      [goalId, userId]
    );

    if (!goal) return false;

    const progress = Math.min(100, Math.round((currentValue / goal.target_value) * 100));
    const status = progress >= 100 ? 'completed' : 'active';

    await db.query(
      `UPDATE wellness_goals
       SET current_value = $1, progress = $2, status = $3, updated_at = NOW()
       WHERE id = $4 AND user_id = $5`,
      [currentValue, progress, status, goalId, userId]
    );

    return true;
  } catch (error) {
    console.error('Error updating goal progress:', error);
    return false;
  }
}

/**
 * Get mood chart data for visualization
 */
export async function getMoodChartData(
  userId: string,
  days: number = 14
): Promise<{ date: string; mood: number; stress: number }[]> {
  try {
    const { rows } = await db.query<{ date: string; mood: number; stress: number }>(
      `SELECT
        created_at::date as date,
        AVG(mood) as mood,
        AVG(CASE stress
          WHEN 'minimal' THEN 1
          WHEN 'mild' THEN 2
          WHEN 'moderate' THEN 3
          WHEN 'high' THEN 4
          WHEN 'severe' THEN 5
        END) as stress
       FROM wellness_entries
       WHERE user_id = $1 AND created_at > NOW() - INTERVAL '${days} days'
       GROUP BY created_at::date
       ORDER BY date ASC`,
      [userId]
    );
    return rows.map(r => ({
      date: r.date,
      mood: Math.round(Number(r.mood) * 10) / 10,
      stress: Math.round(Number(r.stress) * 10) / 10
    }));
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }
}

/**
 * Generate AI recommendations based on wellness data
 */
export async function generateWellnessRecommendations(
  userId: string
): Promise<{ type: string; title: string; description: string; priority: 'low' | 'medium' | 'high' }[]> {
  const recommendations: { type: string; title: string; description: string; priority: 'low' | 'medium' | 'high' }[] = [];

  try {
    const summary = await getWellnessSummary(userId, 'week');
    const todayEntry = await getTodaysMoodEntry(userId);

    // Check-in reminder
    if (!todayEntry) {
      recommendations.push({
        type: 'check_in',
        title: 'Daily Check-In',
        description: "You haven't logged your mood today. A quick check-in helps track your wellness journey.",
        priority: 'medium'
      });
    }

    // Low mood recommendations
    if (summary.averageMood < 4) {
      recommendations.push({
        type: 'therapy',
        title: 'Consider Talking to Someone',
        description: 'Your mood has been lower than usual. Speaking with a therapist might help.',
        priority: 'high'
      });
    }

    // High stress recommendations
    const highStressCount = (summary.stressDistribution.high || 0) + (summary.stressDistribution.severe || 0);
    if (highStressCount > summary.totalEntries / 2) {
      recommendations.push({
        type: 'relaxation',
        title: 'Stress Relief Techniques',
        description: 'You\'ve been experiencing high stress. Try guided breathing or meditation exercises.',
        priority: 'high'
      });
    }

    // Sleep recommendations
    if (summary.averageSleep < 6) {
      recommendations.push({
        type: 'sleep',
        title: 'Improve Sleep Habits',
        description: 'You\'re averaging less than 6 hours of sleep. Consider adjusting your sleep routine.',
        priority: 'medium'
      });
    }

    // Streak encouragement
    if (summary.streakDays >= 7) {
      recommendations.push({
        type: 'celebration',
        title: 'Great Consistency!',
        description: `You've checked in ${summary.streakDays} days in a row. Keep up the amazing work!`,
        priority: 'low'
      });
    }

    // Mood trend notifications
    if (summary.moodTrend === 'improving') {
      recommendations.push({
        type: 'progress',
        title: 'Positive Trend',
        description: 'Your mood has been improving! Whatever you\'re doing, it\'s working.',
        priority: 'low'
      });
    } else if (summary.moodTrend === 'declining') {
      recommendations.push({
        type: 'support',
        title: 'We\'re Here for You',
        description: 'Your mood has been trending down. Don\'t hesitate to reach out for support.',
        priority: 'high'
      });
    }

    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return recommendations;
  }
}

/**
 * Export wellness data for user (GDPR compliance)
 */
export async function exportWellnessData(userId: string): Promise<{
  entries: MoodEntry[];
  goals: WellnessGoal[];
  summary: WellnessSummary;
}> {
  const entries = await getMoodEntries(userId, 365);
  const goals = await getActiveGoals(userId);
  const summary = await getWellnessSummary(userId, 'month');

  return { entries, goals, summary };
}
