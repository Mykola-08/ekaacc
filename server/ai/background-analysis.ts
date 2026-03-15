/**
 * AI Background Analysis Service
 *
 * Runs periodic analysis on user data to generate insights,
 * detect patterns, update profiles, and maintain the personalization system.
 * Designed to be triggered by a cron job or API call.
 */

import { db } from '@/lib/db';
import { generateText } from 'ai';
import { getModel } from './provider';
import { personalizationService } from './personalization-service';
import { contextService } from './context-service';
import { memoryService } from './memory-service';

// ─── Types ─────────────────────────────────────────────────────────────────

interface ActiveUserRow {
  user_id: string;
  last_activity: string;
}

interface MoodPatternRow {
  mood: string;
  mood_score: number;
  energy_level: number | null;
  stress_level: number | null;
  logged_at: string;
}

interface ConversationSummaryRow {
  conversation_count: number;
  message_count: number;
  last_conversation: string;
}

interface AnalysisResult {
  userId: string;
  insightsGenerated: number;
  profileUpdated: boolean;
  patternsDetected: string[];
  error?: string;
}

// ─── Service ───────────────────────────────────────────────────────────────

export const backgroundAnalysis = {
  /**
   * Run full background analysis for all recently active users.
   * Designed to be called by a cron endpoint (e.g. daily).
   */
  async runFullAnalysis(options: { maxUsers?: number; daysActive?: number } = {}): Promise<{
    processed: number;
    results: AnalysisResult[];
    duration: number;
  }> {
    const startTime = Date.now();
    const { maxUsers = 50, daysActive = 7 } = options;

    // Find recently active users
    const activeUsers = await this.getActiveUsers(daysActive, maxUsers);

    const results: AnalysisResult[] = [];

    for (const user of activeUsers) {
      try {
        const result = await this.analyzeUser(user.user_id);
        results.push(result);
      } catch (error) {
        results.push({
          userId: user.user_id,
          insightsGenerated: 0,
          profileUpdated: false,
          patternsDetected: [],
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      processed: results.length,
      results,
      duration: Date.now() - startTime,
    };
  },

  /**
   * Analyze a single user's data for patterns and insights.
   */
  async analyzeUser(userId: string): Promise<AnalysisResult> {
    const result: AnalysisResult = {
      userId,
      insightsGenerated: 0,
      profileUpdated: false,
      patternsDetected: [],
    };

    // 1. Mood pattern analysis
    const moodPatterns = await this.analyzeMoodPatterns(userId);
    if (moodPatterns.length > 0) {
      result.patternsDetected.push(...moodPatterns);
    }

    // 2. Generate new insights
    const insights = await personalizationService.generateInsights(userId);
    result.insightsGenerated = insights.length;

    // 3. Update behavior profile
    const profileUpdated = await this.updateBehaviorProfile(userId);
    result.profileUpdated = profileUpdated;

    // 4. Expire old insights
    await this.expireOldInsights(userId);

    // 5. Log the analysis interaction
    await personalizationService.logInteraction(userId, 'background_analysis', {
      insightsGenerated: insights.length,
      patternsDetected: result.patternsDetected,
      timestamp: new Date().toISOString(),
    });

    return result;
  },

  /**
   * Get users who have been active recently (moods logged, conversations, bookings).
   */
  async getActiveUsers(daysActive: number, limit: number): Promise<ActiveUserRow[]> {
    const { rows } = await db.query<ActiveUserRow>(
      `SELECT DISTINCT user_id, MAX(created_at) as last_activity FROM (
        SELECT user_id, created_at FROM mood_logs WHERE logged_at > NOW() - INTERVAL '${daysActive} days'
        UNION ALL
        SELECT user_id, updated_at as created_at FROM ai_conversations WHERE updated_at > NOW() - INTERVAL '${daysActive} days'
        UNION ALL
        SELECT user_id, created_at FROM ai_interactions WHERE created_at > NOW() - INTERVAL '${daysActive} days'
      ) recent_activity
      GROUP BY user_id
      ORDER BY last_activity DESC
      LIMIT $1`,
      [limit]
    );
    return rows;
  },

  /**
   * Detect mood patterns for a user (time-of-day trends, weekly cycles, triggers).
   */
  async analyzeMoodPatterns(userId: string): Promise<string[]> {
    const { rows: moods } = await db.query<MoodPatternRow>(
      `SELECT mood, mood_score, energy_level, stress_level, logged_at
       FROM mood_logs WHERE user_id = $1 AND logged_at > NOW() - INTERVAL '30 days'
       ORDER BY logged_at ASC`,
      [userId]
    );

    if (moods.length < 3) return []; // Not enough data

    const patterns: string[] = [];

    // Average mood score
    const avgScore = moods.reduce((s, m) => s + m.mood_score, 0) / moods.length;

    // Low mood detection
    const lowMoods = moods.filter((m) => m.mood_score <= 3);
    if (lowMoods.length > moods.length * 0.4) {
      patterns.push('persistent_low_mood');
    }

    // Volatility detection
    const scores = moods.map((m) => m.mood_score);
    const variance = scores.reduce((s, v) => s + Math.pow(v - avgScore, 2), 0) / scores.length;
    if (variance > 4) {
      patterns.push('high_mood_volatility');
    }

    // Stress correlation
    const stressEntries = moods.filter((m) => m.stress_level !== null);
    if (stressEntries.length >= 3) {
      const avgStress =
        stressEntries.reduce((s, m) => s + (m.stress_level || 0), 0) / stressEntries.length;
      if (avgStress > 7) {
        patterns.push('high_stress');
      }
    }

    // Energy trend
    const energyEntries = moods.filter((m) => m.energy_level !== null);
    if (energyEntries.length >= 3) {
      const avgEnergy =
        energyEntries.reduce((s, m) => s + (m.energy_level || 0), 0) / energyEntries.length;
      if (avgEnergy < 4) {
        patterns.push('low_energy');
      }
    }

    // Improving/declining trend
    const mid = Math.floor(moods.length / 2);
    const firstHalfAvg = moods.slice(0, mid).reduce((s, m) => s + m.mood_score, 0) / mid;
    const secondHalfAvg =
      moods.slice(mid).reduce((s, m) => s + m.mood_score, 0) / (moods.length - mid);
    if (secondHalfAvg - firstHalfAvg > 1) patterns.push('mood_improving');
    if (firstHalfAvg - secondHalfAvg > 1) patterns.push('mood_declining');

    return patterns;
  },

  /**
   * Update user's behavior profile based on interaction history.
   */
  async updateBehaviorProfile(userId: string): Promise<boolean> {
    try {
      // Get interaction stats
      const { rows: interactionStats } = await db.query<{
        type: string;
        count: string;
      }>(
        `SELECT type, COUNT(*) as count FROM ai_interactions
         WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 days'
         GROUP BY type`,
        [userId]
      );

      // Get conversation stats
      const { rows: convStats } = await db.query<ConversationSummaryRow>(
        `SELECT COUNT(*) as conversation_count,
                COALESCE(SUM(msg_count), 0) as message_count,
                MAX(c.updated_at) as last_conversation
         FROM ai_conversations c
         LEFT JOIN LATERAL (
           SELECT COUNT(*) as msg_count FROM ai_messages WHERE conversation_id = c.id
         ) msgs ON true
         WHERE c.user_id = $1 AND c.created_at > NOW() - INTERVAL '30 days'`,
        [userId]
      );

      // Get memory categories
      const memories = await memoryService.getMemories(userId, { limit: 30 });
      const memoryTypes: Record<string, number> = {};
      for (const m of memories) {
        memoryTypes[m.memoryType] = (memoryTypes[m.memoryType] || 0) + 1;
      }

      // Build behavior patterns
      const patterns: Record<string, unknown>[] = [];

      for (const stat of interactionStats) {
        patterns.push({
          type: stat.type,
          frequency: parseInt(stat.count),
          period: '30_days',
        });
      }

      // Build preferences from memory categories
      const preferences: Record<string, unknown> = {
        topMemoryTypes: memoryTypes,
        interactionFrequency: interactionStats.reduce((s, i) => s + parseInt(i.count), 0),
        conversationCount: convStats[0]?.conversation_count || 0,
        lastActive: convStats[0]?.last_conversation || null,
      };

      // Build wellness insights from mood patterns
      const moodPatterns = await this.analyzeMoodPatterns(userId);
      const wellnessInsights: Record<string, unknown> = {
        detectedPatterns: moodPatterns,
        analysisDate: new Date().toISOString(),
      };

      await personalizationService.updateProfile(userId, {
        behaviorPatterns: patterns,
        preferences,
        wellnessInsights,
      });

      return true;
    } catch (error) {
      console.error('updateBehaviorProfile failed:', error);
      return false;
    }
  },

  /**
   * Expire insights older than 30 days.
   */
  async expireOldInsights(userId: string): Promise<void> {
    await db
      .query(
        `UPDATE ai_insights SET is_active = false
       WHERE user_id = $1 AND is_active = true
       AND (expires_at IS NOT NULL AND expires_at < NOW()
            OR created_at < NOW() - INTERVAL '30 days')`,
        [userId]
      )
      .catch(() => {});
  },

  /**
   * Generate a personalized daily digest / wellness summary for a user.
   */
  async generateDailySummary(userId: string): Promise<{
    summary: string;
    recommendations: string[];
    moodTrend: string;
  } | null> {
    try {
      const ctx = await contextService.buildContext(userId);

      if (ctx.recentMoods.length === 0 && ctx.memories.length === 0) {
        return null; // Not enough data
      }

      const model = await getModel('fast');

      const { text } = await generateText({
        model,
        system: `You are a wellness analysis engine. Generate a brief daily wellness summary.
Return valid JSON with: summary (2-3 sentences), recommendations (array of 2-3 strings), moodTrend (one word: improving/stable/declining).
Return ONLY the JSON, no markdown.`,
        prompt: `User context:
${ctx.summary}

Recent mood data: ${JSON.stringify(ctx.recentMoods.slice(0, 5))}
Active insights: ${ctx.activeInsights.map((i) => i.title).join(', ') || 'None'}
Upcoming sessions: ${ctx.upcomingBookings.length} booked`,
      });

      const cleaned = text
        .replace(/```json?\n?/g, '')
        .replace(/```/g, '')
        .trim();
      const parsed = JSON.parse(cleaned);

      return {
        summary: parsed.summary || 'Keep up the good work!',
        recommendations: parsed.recommendations || [],
        moodTrend: parsed.moodTrend || 'stable',
      };
    } catch {
      return null;
    }
  },
};
