/**
 * AI Insights Service
 * Generates personalized insights and analytics for users
 *
 * @review - Needs ML model integration for advanced insights
 */
import { db } from '@/lib/db';

export type InsightType = 'wellness' | 'therapy' | 'behavioral' | 'progress' | 'recommendation' | 'mood' | 'engagement';
export type InsightPriority = 'low' | 'medium' | 'high' | 'critical';

export interface AIInsight {
  id: string;
  userId: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number; // 0-1
  priority: InsightPriority;
  actionItems: ActionItem[];
  metadata: Record<string, unknown>;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
}

export interface WellnessScore {
  overall: number; // 0-100
  mood: number;
  stress: number;
  engagement: number;
  consistency: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface UserBehaviorPattern {
  id: string;
  userId: string;
  patternType: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: Record<string, unknown>[];
  status: 'active' | 'resolved' | 'expired';
  firstDetected: Date;
  lastUpdated: Date;
}

/**
 * Get active insights for a user
 */
export async function getActiveInsights(userId: string): Promise<AIInsight[]> {
  try {
    const { rows } = await db.query<AIInsight>(
      `SELECT id, user_id as "userId", type, title, description,
              confidence, action_items as "actionItems", metadata,
              is_active as "isActive", expires_at as "expiresAt",
              created_at as "createdAt",
              CASE
                WHEN confidence >= 0.8 THEN 'high'
                WHEN confidence >= 0.5 THEN 'medium'
                ELSE 'low'
              END as priority
       FROM ai_insights
       WHERE user_id = $1 AND is_active = true
         AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY confidence DESC, created_at DESC
       LIMIT 20`,
      [userId]
    );
    return rows.map(r => ({
      ...r,
      actionItems: r.actionItems || []
    }));
  } catch (error) {
    console.error('Error fetching insights:', error);
    return [];
  }
}

/**
 * Create a new insight for a user
 */
export async function createInsight(
  userId: string,
  type: InsightType,
  title: string,
  description: string,
  confidence: number,
  actionItems: ActionItem[] = [],
  metadata: Record<string, unknown> = {},
  expiresIn?: number // days
): Promise<AIInsight | null> {
  try {
    const expiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000)
      : null;

    const result = await db.queryOne<AIInsight>(
      `INSERT INTO ai_insights (user_id, type, title, description, confidence,
                                action_items, metadata, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, user_id as "userId", type, title, description,
                 confidence, action_items as "actionItems", metadata,
                 is_active as "isActive", expires_at as "expiresAt",
                 created_at as "createdAt"`,
      [userId, type, title, description, confidence, JSON.stringify(actionItems), metadata, expiresAt]
    );
    return result ? { ...result, priority: confidence >= 0.8 ? 'high' : confidence >= 0.5 ? 'medium' : 'low' } : null;
  } catch (error) {
    console.error('Error creating insight:', error);
    return null;
  }
}

/**
 * Calculate wellness score based on user activity
 */
export async function calculateWellnessScore(userId: string): Promise<WellnessScore> {
  try {
    // Get booking completion rate
    const bookingsResult = await db.queryOne<{ total: number; completed: number }>(
      `SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'completed') as completed
       FROM booking
       WHERE customer_reference_id = $1
         AND created_at > NOW() - INTERVAL '30 days'`,
      [userId]
    );

    // Get mood entries
    const moodResult = await db.queryOne<{ avg_mood: number; entries: number }>(
      `SELECT
        AVG((metadata->>'mood')::int) as avg_mood,
        COUNT(*) as entries
       FROM user_memory
       WHERE user_id = $1 AND memory_type = 'mood'
         AND created_at > NOW() - INTERVAL '14 days'`,
      [userId]
    );

    // Get engagement metrics
    const engagementResult = await db.queryOne<{ interactions: number }>(
      `SELECT COUNT(*) as interactions
       FROM ai_interactions
       WHERE user_id = $1
         AND created_at > NOW() - INTERVAL '7 days'`,
      [userId]
    );

    // Calculate scores
    const bookings = bookingsResult || { total: 0, completed: 0 };
    const mood = moodResult || { avg_mood: 5, entries: 0 };
    const engagement = engagementResult || { interactions: 0 };

    const completionRate = bookings.total > 0
      ? (bookings.completed / bookings.total) * 100
      : 50;
    const moodScore = mood.avg_mood ? (mood.avg_mood / 10) * 100 : 50;
    const engagementScore = Math.min(100, (engagement.interactions / 10) * 100);
    const consistencyScore = mood.entries >= 7 ? 100 : mood.entries >= 3 ? 60 : 30;

    // Calculate overall
    const overall = Math.round(
      (completionRate * 0.3) + (moodScore * 0.3) + (engagementScore * 0.2) + (consistencyScore * 0.2)
    );

    // Determine trend (compare with previous period)
    const previousResult = await db.queryOne<{ prev_interactions: number }>(
      `SELECT COUNT(*) as prev_interactions
       FROM ai_interactions
       WHERE user_id = $1
         AND created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days'`,
      [userId]
    );

    const prevEngagement = previousResult?.prev_interactions || 0;
    let trend: WellnessScore['trend'] = 'stable';
    if (engagement.interactions > prevEngagement * 1.2) {
      trend = 'improving';
    } else if (engagement.interactions < prevEngagement * 0.8) {
      trend = 'declining';
    }

    return {
      overall,
      mood: Math.round(moodScore),
      stress: Math.round(100 - moodScore), // Inverse of mood for stress
      engagement: Math.round(engagementScore),
      consistency: Math.round(consistencyScore),
      trend
    };
  } catch (error) {
    console.error('Error calculating wellness score:', error);
    return {
      overall: 50,
      mood: 50,
      stress: 50,
      engagement: 50,
      consistency: 50,
      trend: 'stable'
    };
  }
}

/**
 * Detect behavioral patterns for a user
 */
export async function detectBehavioralPatterns(userId: string): Promise<UserBehaviorPattern[]> {
  try {
    // Check for engagement decline
    const recentActivity = await db.queryOne<{ recent: number; previous: number }>(
      `SELECT
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as recent,
        COUNT(*) FILTER (WHERE created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days') as previous
       FROM ai_interactions
       WHERE user_id = $1`,
      [userId]
    );

    const patterns: UserBehaviorPattern[] = [];

    if (recentActivity) {
      // Engagement decline pattern
      if (recentActivity.previous > 5 && recentActivity.recent < recentActivity.previous * 0.5) {
        patterns.push({
          id: `engagement-decline-${userId}`,
          userId,
          patternType: 'engagement_decline',
          confidence: 0.75,
          severity: 'medium',
          evidence: [{
            recentCount: recentActivity.recent,
            previousCount: recentActivity.previous,
            declinePercentage: ((recentActivity.previous - recentActivity.recent) / recentActivity.previous) * 100
          }],
          status: 'active',
          firstDetected: new Date(),
          lastUpdated: new Date()
        });
      }

      // High activity pattern (positive)
      if (recentActivity.recent >= 10) {
        patterns.push({
          id: `high-activity-${userId}`,
          userId,
          patternType: 'high_activity',
          confidence: 0.9,
          severity: 'low',
          evidence: [{
            recentCount: recentActivity.recent,
            averageDaily: recentActivity.recent / 7
          }],
          status: 'active',
          firstDetected: new Date(),
          lastUpdated: new Date()
        });
      }
    }

    // Check for booking patterns
    const bookingPattern = await db.queryOne<{ canceled: number; total: number }>(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'canceled') as canceled,
        COUNT(*) as total
       FROM booking
       WHERE customer_reference_id = $1
         AND created_at > NOW() - INTERVAL '30 days'`,
      [userId]
    );

    if (bookingPattern && bookingPattern.total >= 3) {
      const cancelRate = bookingPattern.canceled / bookingPattern.total;
      if (cancelRate > 0.3) {
        patterns.push({
          id: `high-cancel-rate-${userId}`,
          userId,
          patternType: 'session_abandonment',
          confidence: cancelRate,
          severity: cancelRate > 0.5 ? 'high' : 'medium',
          evidence: [{
            canceledCount: bookingPattern.canceled,
            totalCount: bookingPattern.total,
            cancelRate: cancelRate * 100
          }],
          status: 'active',
          firstDetected: new Date(),
          lastUpdated: new Date()
        });
      }
    }

    return patterns;
  } catch (error) {
    console.error('Error detecting patterns:', error);
    return [];
  }
}

/**
 * Generate insights based on user data
 */
export async function generateInsights(userId: string): Promise<AIInsight[]> {
  const insights: AIInsight[] = [];

  try {
    // Get wellness score
    const wellness = await calculateWellnessScore(userId);

    // Get behavioral patterns
    const patterns = await detectBehavioralPatterns(userId);

    // Generate wellness insight
    if (wellness.trend === 'declining') {
      const insight = await createInsight(
        userId,
        'wellness',
        'Wellness Trend Alert',
        'Your engagement has been declining over the past week. Consider scheduling a session or checking in with your wellness routine.',
        0.75,
        [
          { id: '1', title: 'Book a wellness session', completed: false },
          { id: '2', title: 'Complete a mood check-in', completed: false }
        ],
        { wellnessScore: wellness.overall },
        7
      );
      if (insight) insights.push(insight);
    }

    // Generate pattern-based insights
    for (const pattern of patterns) {
      if (pattern.patternType === 'engagement_decline') {
        const insight = await createInsight(
          userId,
          'behavioral',
          'Re-engagement Opportunity',
          "We noticed you haven't been as active recently. Your wellness journey is important - let's get back on track!",
          pattern.confidence,
          [
            { id: '1', title: 'Complete a quick check-in', completed: false },
            { id: '2', title: 'Browse recommended services', completed: false }
          ],
          { pattern: pattern.patternType },
          14
        );
        if (insight) insights.push(insight);
      }

      if (pattern.patternType === 'session_abandonment') {
        const insight = await createInsight(
          userId,
          'behavioral',
          'Booking Support Available',
          "We noticed some sessions were canceled. If you're having scheduling difficulties, we're here to help find times that work better for you.",
          pattern.confidence,
          [
            { id: '1', title: 'Review available time slots', completed: false },
            { id: '2', title: 'Set up booking reminders', completed: false }
          ],
          { pattern: pattern.patternType },
          14
        );
        if (insight) insights.push(insight);
      }

      if (pattern.patternType === 'high_activity') {
        const insight = await createInsight(
          userId,
          'progress',
          'Great Progress!',
          "You've been consistently engaged with your wellness journey. Keep up the excellent work!",
          pattern.confidence,
          [
            { id: '1', title: 'Explore advanced features', completed: false },
            { id: '2', title: 'Share your progress', completed: false }
          ],
          { pattern: pattern.patternType },
          30
        );
        if (insight) insights.push(insight);
      }
    }

    // Check for mood-based insights
    const moodTrend = await db.queryOne<{ recent_avg: number; older_avg: number }>(
      `SELECT
        AVG((metadata->>'mood')::int) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as recent_avg,
        AVG((metadata->>'mood')::int) FILTER (WHERE created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days') as older_avg
       FROM user_memory
       WHERE user_id = $1 AND memory_type = 'mood'`,
      [userId]
    );

    if (moodTrend && moodTrend.recent_avg && moodTrend.older_avg) {
      if (moodTrend.recent_avg > moodTrend.older_avg * 1.2) {
        const insight = await createInsight(
          userId,
          'mood',
          'Mood Improvement Detected',
          'Your mood has been trending upward! Keep doing what works for you.',
          0.8,
          [],
          { recentAvg: moodTrend.recent_avg, olderAvg: moodTrend.older_avg },
          7
        );
        if (insight) insights.push(insight);
      } else if (moodTrend.recent_avg < moodTrend.older_avg * 0.8) {
        const insight = await createInsight(
          userId,
          'mood',
          'Mood Support Available',
          "We've noticed a dip in your mood tracking. Remember, support is always available when you need it.",
          0.8,
          [
            { id: '1', title: 'Talk to a therapist', completed: false },
            { id: '2', title: 'Try a guided exercise', completed: false }
          ],
          { recentAvg: moodTrend.recent_avg, olderAvg: moodTrend.older_avg },
          7
        );
        if (insight) insights.push(insight);
      }
    }

    return insights;
  } catch (error) {
    console.error('Error generating insights:', error);
    return insights;
  }
}

/**
 * Mark an insight action item as complete
 */
export async function completeActionItem(
  insightId: string,
  actionItemId: string,
  userId: string
): Promise<boolean> {
  try {
    const insight = await db.queryOne<{ action_items: ActionItem[] }>(
      `SELECT action_items FROM ai_insights WHERE id = $1 AND user_id = $2`,
      [insightId, userId]
    );

    if (!insight) return false;

    const updatedItems = (insight.action_items || []).map(item =>
      item.id === actionItemId ? { ...item, completed: true } : item
    );

    await db.query(
      `UPDATE ai_insights SET action_items = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3`,
      [JSON.stringify(updatedItems), insightId, userId]
    );

    return true;
  } catch (error) {
    console.error('Error completing action item:', error);
    return false;
  }
}

/**
 * Dismiss an insight
 */
export async function dismissInsight(insightId: string, userId: string): Promise<boolean> {
  try {
    const result = await db.query(
      `UPDATE ai_insights SET is_active = false, updated_at = NOW()
       WHERE id = $1 AND user_id = $2`,
      [insightId, userId]
    );
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error('Error dismissing insight:', error);
    return false;
  }
}

/**
 * Get AI profile for a user
 */
export async function getAIUserProfile(userId: string): Promise<Record<string, unknown> | null> {
  try {
    const result = await db.queryOne<{
      behavior_patterns: unknown;
      preferences: unknown;
      wellness_insights: unknown;
      adaptive_settings: unknown;
    }>(
      `SELECT behavior_patterns, preferences, wellness_insights, adaptive_settings
       FROM ai_user_profiles
       WHERE user_id = $1`,
      [userId]
    );

    if (!result) {
      // Create default profile
      await db.query(
        `INSERT INTO ai_user_profiles (user_id, behavior_patterns, preferences, wellness_insights, adaptive_settings)
         VALUES ($1, '[]'::jsonb, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb)
         ON CONFLICT (user_id) DO NOTHING`,
        [userId]
      );
      return { behaviorPatterns: [], preferences: {}, wellnessInsights: {}, adaptiveSettings: {} };
    }

    return {
      behaviorPatterns: result.behavior_patterns || [],
      preferences: result.preferences || {},
      wellnessInsights: result.wellness_insights || {},
      adaptiveSettings: result.adaptive_settings || {}
    };
  } catch (error) {
    console.error('Error fetching AI profile:', error);
    return null;
  }
}

/**
 * Update AI user profile
 */
export async function updateAIUserProfile(
  userId: string,
  updates: {
    behaviorPatterns?: unknown[];
    preferences?: Record<string, unknown>;
    wellnessInsights?: Record<string, unknown>;
    adaptiveSettings?: Record<string, unknown>;
  }
): Promise<boolean> {
  try {
    const setClauses: string[] = [];
    const params: unknown[] = [userId];
    let paramIndex = 2;

    if (updates.behaviorPatterns !== undefined) {
      setClauses.push(`behavior_patterns = $${paramIndex}`);
      params.push(JSON.stringify(updates.behaviorPatterns));
      paramIndex++;
    }
    if (updates.preferences !== undefined) {
      setClauses.push(`preferences = $${paramIndex}`);
      params.push(updates.preferences);
      paramIndex++;
    }
    if (updates.wellnessInsights !== undefined) {
      setClauses.push(`wellness_insights = $${paramIndex}`);
      params.push(updates.wellnessInsights);
      paramIndex++;
    }
    if (updates.adaptiveSettings !== undefined) {
      setClauses.push(`adaptive_settings = $${paramIndex}`);
      params.push(updates.adaptiveSettings);
      paramIndex++;
    }

    if (setClauses.length === 0) return true;

    setClauses.push('last_updated = NOW()');

    await db.query(
      `INSERT INTO ai_user_profiles (user_id, behavior_patterns, preferences, wellness_insights, adaptive_settings)
       VALUES ($1, '[]'::jsonb, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb)
       ON CONFLICT (user_id) DO UPDATE SET ${setClauses.join(', ')}`,
      params
    );

    return true;
  } catch (error) {
    console.error('Error updating AI profile:', error);
    return false;
  }
}
