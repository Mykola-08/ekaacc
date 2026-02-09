/**
 * AI Personalization Service
 *
 * Background analysis and insight generation. Processes user interactions,
 * mood patterns, and conversation history to produce wellness insights
 * and adaptive recommendations.
 */

import { db } from '@/lib/db';
import { generateText } from 'ai';
import { getModel } from './provider';
import { memoryService } from './memory-service';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface WellnessInsight {
  id: string;
  type: 'wellness' | 'therapy' | 'behavioral' | 'progress' | 'recommendation' | 'mood' | 'engagement';
  title: string;
  description: string;
  confidence: number;
  actionItems: string[];
  metadata: Record<string, unknown>;
}

interface InsightRow {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  action_items: string[];
  metadata: Record<string, unknown>;
  created_at: string;
}

interface MoodRow {
  mood: string;
  mood_score: number;
  energy_level: number | null;
  stress_level: number | null;
  logged_at: string;
  notes: string | null;
}

// ─── Service ───────────────────────────────────────────────────────────────

export const personalizationService = {
  /**
   * Log a mood entry.
   */
  async logMood(
    userId: string,
    mood: string,
    score: number,
    opts: {
      energy?: number;
      stress?: number;
      sleepQuality?: number;
      notes?: string;
      factors?: string[];
    } = {}
  ): Promise<string> {
    const { rows } = await db.query<{ id: string }>(
      `INSERT INTO mood_logs (user_id, mood, mood_score, energy_level, stress_level, sleep_quality, notes, factors)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [userId, mood, score, opts.energy ?? null, opts.stress ?? null, opts.sleepQuality ?? null, opts.notes ?? null, opts.factors ?? []]
    );
    return rows[0].id;
  },

  /**
   * Get recent moods with trend analysis.
   */
  async getMoodTrend(
    userId: string,
    days = 14
  ): Promise<{ moods: MoodRow[]; averageScore: number; trend: 'improving' | 'declining' | 'stable' }> {
    const { rows } = await db.query<MoodRow>(
      `SELECT mood, mood_score, energy_level, stress_level, logged_at, notes
       FROM mood_logs WHERE user_id = $1 AND logged_at > NOW() - INTERVAL '${days} days'
       ORDER BY logged_at ASC`,
      [userId]
    );

    if (rows.length === 0) {
      return { moods: [], averageScore: 0, trend: 'stable' };
    }

    const avgScore = rows.reduce((s, r) => s + r.mood_score, 0) / rows.length;

    // Simple trend: compare first-half avg to second-half avg
    const mid = Math.floor(rows.length / 2);
    const firstHalf = rows.slice(0, mid || 1);
    const secondHalf = rows.slice(mid || 1);

    const firstAvg = firstHalf.reduce((s, r) => s + r.mood_score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((s, r) => s + r.mood_score, 0) / secondHalf.length;

    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (secondAvg - firstAvg > 0.5) trend = 'improving';
    else if (firstAvg - secondAvg > 0.5) trend = 'declining';

    return { moods: rows, averageScore: Math.round(avgScore * 10) / 10, trend };
  },

  /**
   * Generate AI-powered wellness insights from user data.
   * This runs in the background and stores insights in the DB.
   */
  async generateInsights(userId: string): Promise<WellnessInsight[]> {
    try {
      // Gather data
      const [moodTrend, memories] = await Promise.all([
        this.getMoodTrend(userId, 30),
        memoryService.getMemories(userId, { limit: 15 }),
      ]);

      if (moodTrend.moods.length === 0 && memories.length === 0) {
        return [];
      }

      const model = await getModel('fast');

      const { text } = await generateText({
        model,
        system: `You are a wellness analysis engine. Analyze the user's data and provide actionable insights.
Return a JSON array of insights, each with: type (wellness/therapy/behavioral/progress/recommendation/mood), title, description, confidence (0-1), actionItems (string array).
Return ONLY the JSON array, no markdown.`,
        prompt: `User data to analyze:

MOOD TREND (last 30 days):
Average score: ${moodTrend.averageScore}/10
Trend: ${moodTrend.trend}
Recent entries: ${JSON.stringify(moodTrend.moods.slice(-5))}

MEMORIES:
${memories.map((m) => `- [${m.memoryType}] ${m.content}`).join('\n')}

Generate 2-4 personalized wellness insights.`,
      });

      // Parse the result
      let insights: WellnessInsight[] = [];
      try {
        const cleaned = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        insights = (Array.isArray(parsed) ? parsed : []).map((item: any, i: number) => ({
          id: `insight_${Date.now()}_${i}`,
          type: item.type || 'wellness',
          title: item.title || 'Wellness Insight',
          description: item.description || '',
          confidence: item.confidence || 0.7,
          actionItems: item.actionItems || [],
          metadata: {},
        }));
      } catch {
        console.warn('Failed to parse AI insights response');
        return [];
      }

      // Store insights in the database
      for (const insight of insights) {
        await db.query(
          `INSERT INTO ai_insights (user_id, insight_id, type, title, description, confidence, action_items)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT DO NOTHING`,
          [userId, insight.id, insight.type, insight.title, insight.description, insight.confidence, JSON.stringify(insight.actionItems)]
        ).catch(() => {}); // Best-effort
      }

      return insights;
    } catch (error) {
      console.error('generateInsights failed:', error);
      return [];
    }
  },

  /**
   * Get active insights for a user.
   */
  async getActiveInsights(userId: string): Promise<WellnessInsight[]> {
    const { rows } = await db.query<InsightRow>(
      `SELECT * FROM ai_insights
       WHERE user_id = $1 AND is_active = true
       ORDER BY created_at DESC LIMIT 10`,
      [userId]
    );

    return rows.map((r) => ({
      id: r.id,
      type: r.type as WellnessInsight['type'],
      title: r.title,
      description: r.description || '',
      confidence: Number(r.confidence) || 0,
      actionItems: Array.isArray(r.action_items) ? r.action_items : [],
      metadata: r.metadata || {},
    }));
  },

  /**
   * Update the user's AI profile with new behavior patterns.
   */
  async updateProfile(
    userId: string,
    updates: {
      behaviorPatterns?: unknown[];
      preferences?: Record<string, unknown>;
      wellnessInsights?: Record<string, unknown>;
    }
  ): Promise<void> {
    await db.query(
      `INSERT INTO ai_user_profiles (user_id, behavior_patterns, preferences, wellness_insights)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET
         behavior_patterns = COALESCE($2, ai_user_profiles.behavior_patterns),
         preferences = COALESCE($3, ai_user_profiles.preferences),
         wellness_insights = COALESCE($4, ai_user_profiles.wellness_insights),
         last_updated = NOW()`,
      [
        userId,
        JSON.stringify(updates.behaviorPatterns ?? []),
        JSON.stringify(updates.preferences ?? {}),
        JSON.stringify(updates.wellnessInsights ?? {}),
      ]
    );
  },

  /**
   * Log a user interaction for pattern analysis.
   */
  async logInteraction(
    userId: string,
    type: string,
    context: Record<string, unknown> = {}
  ): Promise<void> {
    await db.query(
      `INSERT INTO ai_interactions (user_id, type, context) VALUES ($1, $2, $3)`,
      [userId, type, JSON.stringify(context)]
    );
  },
};
