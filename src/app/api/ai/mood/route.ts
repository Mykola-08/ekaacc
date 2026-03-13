/**
 * AI Mood Logging API
 *
 * POST /api/ai/mood — Log a mood entry
 * GET  /api/ai/mood — Get mood trend
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { personalizationService } from '@/server/ai';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { mood, score, energy, stress, sleepQuality, notes, factors } = body;

    if (!mood || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'mood (string) and score (number) are required' },
        { status: 400 }
      );
    }

    const id = await personalizationService.logMood(user.id, mood, score, {
      energy,
      stress,
      sleepQuality,
      notes,
      factors,
    });

    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error('[AI Mood POST]', error);
    return NextResponse.json({ error: 'Failed to log mood' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '14', 10);

    const trend = await personalizationService.getMoodTrend(user.id, days);

    return NextResponse.json(trend);
  } catch (error) {
    console.error('[AI Mood GET]', error);
    return NextResponse.json({ error: 'Failed to get mood trend' }, { status: 500 });
  }
}
