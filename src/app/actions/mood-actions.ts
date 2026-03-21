'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Log a mood entry for today. Upserts so multiple calls on the same day
 * update the existing entry rather than creating duplicates.
 */
export async function logMoodEntry(
  score: number,
  note?: string,
  tags?: string[]
): Promise<{ success: boolean; error?: string }> {
  if (score < 1 || score > 10) return { success: false, error: 'Score must be between 1 and 10' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Check if entry exists for today (update it if so)
  const { data: existing } = await supabase
    .from('mood_entries')
    .select('id')
    .eq('user_id', user.id)
    .gte('logged_at', todayStart.toISOString())
    .lte('logged_at', todayEnd.toISOString())
    .limit(1)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('mood_entries')
      .update({ score, note: note ?? null, tags: tags ?? [] })
      .eq('id', existing.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from('mood_entries').insert({
      user_id: user.id,
      score,
      note: note ?? null,
      tags: tags ?? [],
      logged_at: new Date().toISOString(),
    });
    if (error) return { success: false, error: error.message };
  }

  // Also update the streak via RPC
  await supabase.rpc('log_user_activity', {
    p_user_id: user.id,
    p_activity_type: 'mood_checkin',
    p_event: 'mood_logged',
    p_xp_earned: 5,
  });

  revalidatePath('/dashboard');
  revalidatePath('/wellness');
  revalidatePath('/ai-insights');

  return { success: true };
}

/**
 * Fetch today's mood entry score for the current user, or null if not logged.
 */
export async function getTodayMood(): Promise<number | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from('mood_entries')
    .select('score')
    .eq('user_id', user.id)
    .gte('logged_at', todayStart.toISOString())
    .order('logged_at', { ascending: false })
    .limit(1)
    .single();

  return data?.score ?? null;
}

/**
 * Get mood entries for a date range.
 */
export async function getMoodHistory(
  days = 30
): Promise<Array<{ score: number; logged_at: string; note: string | null }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('mood_entries')
    .select('score, logged_at, note')
    .eq('user_id', user.id)
    .gte('logged_at', since)
    .order('logged_at', { ascending: false });

  return data ?? [];
}
