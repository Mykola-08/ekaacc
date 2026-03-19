'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getGoals(status = 'active') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Unauthenticated' };

  const query = supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (status !== 'all') query.eq('status', status);

  const { data, error } = await query;
  return { data: data ?? [], error: error?.message ?? null };
}

export async function createGoal(input: {
  title: string;
  description?: string;
  category?: string;
  target_date?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('goals')
    .insert({ ...input, user_id: user.id, progress_percentage: 0, status: 'active' })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath('/goals');
  return { success: true, data };
}

export async function updateGoalProgress(id: string, progress: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const isAchieved = normalizedProgress >= 100;
  const { error } = await supabase
    .from('goals')
    .update({
      progress_percentage: normalizedProgress,
      status: isAchieved ? 'completed' : 'active',
      is_achieved: isAchieved,
      achieved_at: isAchieved ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  const { error: historyError } = await supabase.from('goal_progress_history').insert({
    goal_id: id,
    progress_percentage: normalizedProgress,
    user_id: user.id,
  });

  if (historyError) {
    // Do not fail the main goal update if the optional history table is not yet migrated.
    console.warn('Goal progress history insert failed:', historyError.message);
  }

  revalidatePath('/goals');
  return { success: true };
}

export async function getGoalProgressHistory(goalId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('goal_progress_history')
    .select('id, progress_percentage, recorded_at')
    .eq('goal_id', goalId)
    .eq('user_id', user.id)
    .order('recorded_at', { ascending: false })
    .limit(12);

  return { data: data ?? [], error: error?.message ?? null };
}

export async function deleteGoal(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/goals');
  return { success: true };
}
