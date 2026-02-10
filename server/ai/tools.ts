/**
 * AI Agent Tools
 *
 * Defines the tools available to the AI assistant during conversations.
 * These tools enable the agent to perform actions like mood logging,
 * booking lookups, wallet checks, and wellness tracking.
 */

import { tool } from 'ai';
import { z } from 'zod';
import { db } from '@/lib/db';
import { personalizationService } from './personalization-service';
import { memoryService } from './memory-service';

// ─── Types ─────────────────────────────────────────────────────────────────

interface BookingRow {
  id: string;
  service_name: string;
  start_time: string;
  status: string;
  therapist_name: string | null;
}

interface WalletRow {
  balance: number;
  currency: string;
}

interface ServiceRow {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  currency: string;
}

// ─── Tool Definitions ──────────────────────────────────────────────────────

/**
 * Create all AI tools for a specific user session.
 */
export function createTools(userId: string) {
  return {
    logMood: tool({
      description:
        'Log the user\'s current mood. Use when the user shares how they feel. Mood score is 1-10 (1=terrible, 10=excellent).',
      inputSchema: z.object({
        mood: z.enum(['excellent', 'good', 'neutral', 'bad', 'terrible']),
        score: z.number().min(1).max(10),
        energy: z.number().min(1).max(10).optional(),
        stress: z.number().min(1).max(10).optional(),
        notes: z.string().optional(),
        factors: z.array(z.string()).optional(),
      }),
      execute: async ({ mood, score, energy, stress, notes, factors }) => {
        const id = await personalizationService.logMood(userId, mood, score, {
          energy,
          stress,
          notes,
          factors,
        });
        return {
          success: true,
          id,
          message: `Mood logged: ${mood} (${score}/10)`,
          _visualBlock: {
            type: 'mood-logged',
            mood,
            score,
            energy,
            stress,
          },
        };
      },
    }),

    getMoodTrend: tool({
      description:
        'Get the user\'s mood trend over a period. Use when they ask about their mood history or patterns.',
      inputSchema: z.object({
        days: z.number().min(1).max(90).default(14),
      }),
      execute: async ({ days }) => {
        const trend = await personalizationService.getMoodTrend(userId, days);
        return {
          ...trend,
          _visualBlock: {
            type: 'mood-trend',
            moods: trend.moods.map((m) => ({
              score: m.mood_score,
              mood: m.mood,
              date: m.logged_at,
            })),
            averageScore: trend.averageScore,
            trend: trend.trend,
            days,
          },
        };
      },
    }),

    getUpcomingBookings: tool({
      description: 'Get the user\'s upcoming therapy/wellness bookings.',
      inputSchema: z.object({}),
      execute: async () => {
        const { rows } = await db.query<BookingRow>(
          `SELECT id, service_name, start_time, status, therapist_name
           FROM bookings
           WHERE user_id = $1 AND start_time > NOW() AND status != 'canceled'
           ORDER BY start_time ASC LIMIT 5`,
          [userId]
        );

        return {
          bookings: rows.map((b) => ({
            id: b.id,
            service: b.service_name,
            date: b.start_time,
            status: b.status,
            therapist: b.therapist_name,
          })),
          _visualBlock: {
            type: 'upcoming-bookings',
            bookings: rows.map((b) => ({
              id: b.id,
              service: b.service_name,
              date: b.start_time,
              status: b.status,
              therapist: b.therapist_name,
            })),
          },
        };
      },
    }),

    getWalletBalance: tool({
      description: 'Get the user\'s wallet balance.',
      inputSchema: z.object({}),
      execute: async () => {
        const { rows } = await db.query<WalletRow>(
          `SELECT balance, currency FROM wallets WHERE user_id = $1 LIMIT 1`,
          [userId]
        );

        const wallet = rows[0] || { balance: 0, currency: 'EUR' };
        return {
          balance: wallet.balance,
          currency: wallet.currency,
          _visualBlock: {
            type: 'wallet-balance',
            balance: wallet.balance,
            currency: wallet.currency,
          },
        };
      },
    }),

    browseServices: tool({
      description:
        'Browse available wellness and therapy services. Use when a user asks what services or sessions are available.',
      inputSchema: z.object({
        search: z.string().optional().describe('Optional search term'),
      }),
      execute: async ({ search }) => {
        let query = `SELECT id, name, description, duration, price, currency
                     FROM services WHERE is_active = true`;
        const params: unknown[] = [];

        if (search) {
          query += ` AND (name ILIKE $1 OR description ILIKE $1)`;
          params.push(`%${search}%`);
        }

        query += ` ORDER BY name ASC LIMIT 8`;

        const { rows } = await db.query<ServiceRow>(query, params);

        return {
          services: rows,
          _visualBlock: {
            type: 'services-list',
            services: rows.map((s) => ({
              id: s.id,
              name: s.name,
              description: s.description,
              duration: s.duration,
              price: s.price,
              currency: s.currency,
            })),
          },
        };
      },
    }),

    saveMemory: tool({
      description:
        'Save an important piece of information about the user for future reference. Use when the user shares preferences, goals, or important facts.',
      inputSchema: z.object({
        content: z.string().describe('The information to remember'),
        type: z
          .enum(['preference', 'fact', 'goal', 'mood', 'observation'])
          .default('observation'),
        importance: z.number().min(1).max(5).default(3),
      }),
      execute: async ({ content, type, importance }) => {
        await memoryService.addMemory(userId, content, type, importance);
        return { success: true, message: `Remembered: "${content}"` };
      },
    }),

    generateInsights: tool({
      description:
        'Generate personalized wellness insights based on the user\'s data. Use when they ask for analysis or recommendations.',
      inputSchema: z.object({}),
      execute: async () => {
        const insights = await personalizationService.generateInsights(userId);
        return {
          insights: insights.map((i) => ({
            type: i.type,
            title: i.title,
            description: i.description,
            confidence: i.confidence,
            actionItems: i.actionItems,
          })),
          _visualBlock: {
            type: 'wellness-insights',
            insights: insights.map((i) => ({
              type: i.type,
              title: i.title,
              description: i.description,
              actionItems: i.actionItems,
            })),
          },
        };
      },
    }),
  };
}
