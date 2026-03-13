/**
 * AI Context Service
 *
 * Builds rich user context for AI conversations by aggregating data
 * from multiple sources: user profile, mood logs, memories, insights,
 * bookings, and personalization profile.
 */

import { db } from '@/lib/db';
import { memoryService } from './memory-service';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface UserContext {
  /** Basic user info */
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  /** Personalization profile */
  profile: {
    behaviorPatterns: unknown[];
    preferences: Record<string, unknown>;
    wellnessInsights: Record<string, unknown>;
  } | null;
  /** Recent mood entries */
  recentMoods: Array<{
    mood: string;
    score: number;
    energy: number | null;
    stress: number | null;
    notes: string | null;
    loggedAt: string;
  }>;
  /** Distilled memories */
  memories: string[];
  /** Active AI insights */
  activeInsights: Array<{
    type: string;
    title: string;
    description: string;
  }>;
  /** Upcoming bookings */
  upcomingBookings: Array<{
    date: string;
    serviceName: string;
    status: string;
  }>;
  /** Summary suitable for system prompt injection */
  summary: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

interface ProfileRow {
  user_id: string;
  behavior_patterns: unknown[];
  preferences: Record<string, unknown>;
  wellness_insights: Record<string, unknown>;
}

interface MoodRow {
  mood: string;
  mood_score: number;
  energy_level: number | null;
  stress_level: number | null;
  notes: string | null;
  logged_at: string;
}

interface InsightRow {
  type: string;
  title: string;
  description: string;
}

interface BookingRow {
  start_time: string;
  service_name: string;
  status: string;
}

interface UserRow {
  id: string;
  raw_user_meta_data: Record<string, unknown>;
  email: string | null;
}

// ─── Service ───────────────────────────────────────────────────────────────

export const contextService = {
  /**
   * Build full user context for AI conversations.
   */
  async buildContext(userId: string): Promise<UserContext> {
    // Run all queries in parallel for speed
    const [userResult, profileResult, moodsResult, insightsResult, bookingsResult, memories] =
      await Promise.all([
        db.query<UserRow>(
          `SELECT id, raw_user_meta_data, email FROM auth.users WHERE id = $1`,
          [userId]
        ).catch(() => ({ rows: [] as UserRow[] })),

        db.query<ProfileRow>(
          `SELECT user_id, 
                  behavior_patterns,
                  preferences,
                  wellness_insights
           FROM ai_personalization_profiles WHERE user_id = $1`,
          [userId]
        ).catch(() => ({ rows: [] as ProfileRow[] })),

        db.query<MoodRow>(
          `SELECT mood, mood_score, energy_level, stress_level, notes, logged_at
           FROM mood_logs WHERE user_id = $1
           ORDER BY logged_at DESC LIMIT 5`,
          [userId]
        ).catch(() => ({ rows: [] as MoodRow[] })),

        db.query<InsightRow>(
          `SELECT type, title, description FROM ai_insights
           WHERE user_id = $1 AND is_active = true
           ORDER BY created_at DESC LIMIT 5`,
          [userId]
        ).catch(() => ({ rows: [] as InsightRow[] })),

        db.query<BookingRow>(
          `SELECT start_time, service_name, status FROM bookings
           WHERE user_id = $1 AND start_time > NOW()
           ORDER BY start_time ASC LIMIT 3`,
          [userId]
        ).catch(() => ({ rows: [] as BookingRow[] })),

        memoryService.getContextMemories(userId, 10).catch(() => [] as string[]),
      ]);

    const userRow = userResult.rows[0];
    const profileRow = profileResult.rows[0];

    const user = {
      id: userId,
      name: (userRow?.raw_user_meta_data?.full_name as string) || null,
      email: userRow?.email || null,
    };

    const profile = profileRow
      ? {
          behaviorPatterns: profileRow.behavior_patterns,
          preferences: profileRow.preferences,
          wellnessInsights: profileRow.wellness_insights,
        }
      : null;

    const recentMoods = moodsResult.rows.map((m) => ({
      mood: m.mood,
      score: m.mood_score,
      energy: m.energy_level,
      stress: m.stress_level,
      notes: m.notes,
      loggedAt: m.logged_at,
    }));

    const activeInsights = insightsResult.rows.map((i) => ({
      type: i.type,
      title: i.title,
      description: i.description || '',
    }));

    const upcomingBookings = bookingsResult.rows.map((b) => ({
      date: b.start_time,
      serviceName: b.service_name || 'Session',
      status: b.status,
    }));

    // Build a natural language summary for the system prompt
    const parts: string[] = [];

    if (user.name) parts.push(`The user's name is ${user.name}.`);

    if (recentMoods.length > 0) {
      const latest = recentMoods[0];
      parts.push(
        `Their most recent mood is "${latest.mood}" (score: ${latest.score}/10).` +
          (latest.energy ? ` Energy: ${latest.energy}/10.` : '') +
          (latest.stress ? ` Stress: ${latest.stress}/10.` : '')
      );
    }

    if (memories.length > 0) {
      parts.push(`Key context about the user:\n${memories.join('\n')}`);
    }

    if (activeInsights.length > 0) {
      parts.push(
        `Active wellness insights:\n` +
          activeInsights.map((i) => `- ${i.title}: ${i.description}`).join('\n')
      );
    }

    if (upcomingBookings.length > 0) {
      parts.push(
        `Upcoming sessions:\n` +
          upcomingBookings
            .map((b) => `- ${b.serviceName} on ${new Date(b.date).toLocaleDateString()}`)
            .join('\n')
      );
    }

    if (profile?.preferences && Object.keys(profile.preferences).length > 0) {
      parts.push(`User preferences: ${JSON.stringify(profile.preferences)}`);
    }

    return {
      user,
      profile,
      recentMoods,
      memories,
      activeInsights,
      upcomingBookings,
      summary: parts.join('\n\n'),
    };
  },

  /**
   * Build a compact context string (for token-constrained scenarios).
   */
  async buildCompactContext(userId: string): Promise<string> {
    const ctx = await this.buildContext(userId);
    return ctx.summary || 'No additional user context available.';
  },
};
