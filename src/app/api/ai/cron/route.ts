/**
 * AI Background Analysis Cron Endpoint
 *
 * GET /api/ai/cron — Trigger background analysis
 *
 * Secured by CRON_SECRET header for Vercel Cron Jobs.
 * Also runnable manually by authenticated admins.
 */

import { NextRequest, NextResponse } from 'next/server';
import { backgroundAnalysis } from '@/server/ai';

export const maxDuration = 300; // 5 minute timeout for background work

export async function GET(req: NextRequest) {
  try {
    // Verify authorization: either CRON_SECRET or admin user
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
      // Authorized via cron secret
    } else {
      // Check for admin user session
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check admin role
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const { processed, results, duration } = await backgroundAnalysis.runFullAnalysis();

    return NextResponse.json({
      success: true,
      processedUsers: processed,
      durationMs: duration,
      results: results.map((r) => ({
        userId: r.userId.slice(0, 8) + '...',
        insightsGenerated: r.insightsGenerated,
        profileUpdated: r.profileUpdated,
        patternsDetected: r.patternsDetected,
        error: r.error,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[AI Cron]', error);
    return NextResponse.json({ error: 'Background analysis failed' }, { status: 500 });
  }
}
