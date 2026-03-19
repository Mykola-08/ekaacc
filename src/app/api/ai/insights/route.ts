/**
 * AI Insights API
 *
 * GET  /api/ai/insights  – get active insights
 * POST /api/ai/insights  – trigger insight generation
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { personalizationService } from '@/server/ai';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const insights = await personalizationService.getActiveInsights(user.id);
  return NextResponse.json({ insights });
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [{ count: journalCount }, { data: latestInsight }] = await Promise.all([
    supabase
      .from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('ai_insights')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if ((journalCount ?? 0) < 4) {
    return NextResponse.json({
      insights: [],
      skipped: true,
      reason: 'Not enough journal entries yet (need at least 4).',
    });
  }

  if (latestInsight?.created_at) {
    const latestAt = new Date(latestInsight.created_at).getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - latestAt < sevenDaysMs) {
      return NextResponse.json({
        insights: [],
        skipped: true,
        reason: 'Insights were generated recently.',
      });
    }
  }

  const insights = await personalizationService.generateInsights(user.id);
  return NextResponse.json({ insights, skipped: false });
}
