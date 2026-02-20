/**
 * AI Daily Summary API
 *
 * GET /api/ai/summary — Get personalized daily wellness summary for the current user
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { backgroundAnalysis } from '@/server/ai';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Check for a cached summary from today unless force refresh
    if (!forceRefresh) {
      const { db } = await import('@/lib/db');
      const { rows } = await db.query<{ description: string; metadata: Record<string, unknown>; created_at: string }>(
        `SELECT description, metadata, created_at FROM ai_insights
         WHERE user_id = $1 AND type = 'wellness' AND title = 'Daily Wellness Summary'
         AND created_at > NOW() - INTERVAL '12 hours' AND is_active = true
         ORDER BY created_at DESC LIMIT 1`,
        [user.id]
      );

      if (rows.length > 0) {
        return NextResponse.json({
          summary: rows[0].description,
          metadata: rows[0].metadata,
          generatedAt: rows[0].created_at,
          cached: true,
        });
      }
    }

    // Generate fresh summary
    const result = await backgroundAnalysis.generateDailySummary(user.id);

    if (!result) {
      return NextResponse.json({
        summary: null,
        generatedAt: new Date().toISOString(),
        cached: false,
      });
    }

    return NextResponse.json({
      summary: result.summary,
      recommendations: result.recommendations,
      moodTrend: result.moodTrend,
      generatedAt: new Date().toISOString(),
      cached: false,
    });
  } catch (error) {
    console.error('[AI Summary GET]', error);
    return NextResponse.json(
      { error: 'Failed to get daily summary' },
      { status: 500 }
    );
  }
}
