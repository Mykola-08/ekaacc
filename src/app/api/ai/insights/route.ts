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

  const insights = await personalizationService.generateInsights(user.id);
  return NextResponse.json({ insights });
}
