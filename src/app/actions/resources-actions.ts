'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSavedResourceIds() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [] as string[];

  const { data } = await supabase
    .from('saved_resources')
    .select('resource_id')
    .eq('user_id', user.id);

  return (data ?? []).map((row: any) => row.resource_id as string);
}

export async function getSavedResourceState() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return {} as Record<string, { completed: boolean; lastOpenedAt: string | null }>;

  const { data } = await supabase
    .from('saved_resources')
    .select('resource_id, completed_at, last_opened_at')
    .eq('user_id', user.id);

  const state: Record<string, { completed: boolean; lastOpenedAt: string | null }> = {};
  for (const row of data ?? []) {
    state[row.resource_id as string] = {
      completed: Boolean((row as any).completed_at),
      lastOpenedAt: ((row as any).last_opened_at as string | null) ?? null,
    };
  }

  return state;
}

export async function toggleSavedResource(resourceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthenticated' };

  const { data: existing } = await supabase
    .from('saved_resources')
    .select('resource_id')
    .eq('user_id', user.id)
    .eq('resource_id', resourceId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('saved_resources')
      .delete()
      .eq('user_id', user.id)
      .eq('resource_id', resourceId);

    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from('saved_resources').insert({
      user_id: user.id,
      resource_id: resourceId,
    });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/resources');
  return { success: true };
}

export async function markResourceOpened(resourceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthenticated' };

  const now = new Date().toISOString();
  const { data: existing } = await supabase
    .from('saved_resources')
    .select('resource_id')
    .eq('user_id', user.id)
    .eq('resource_id', resourceId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('saved_resources')
      .update({ last_opened_at: now })
      .eq('user_id', user.id)
      .eq('resource_id', resourceId);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from('saved_resources').insert({
      user_id: user.id,
      resource_id: resourceId,
      last_opened_at: now,
    });
    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/resources');
  return { success: true };
}

export async function toggleResourceCompleted(resourceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthenticated' };

  const { data: existing } = await supabase
    .from('saved_resources')
    .select('resource_id, completed_at')
    .eq('user_id', user.id)
    .eq('resource_id', resourceId)
    .maybeSingle();

  const completedAt = (existing as any)?.completed_at ? null : new Date().toISOString();

  if (existing) {
    const { error } = await supabase
      .from('saved_resources')
      .update({ completed_at: completedAt })
      .eq('user_id', user.id)
      .eq('resource_id', resourceId);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from('saved_resources').insert({
      user_id: user.id,
      resource_id: resourceId,
      completed_at: completedAt,
      last_opened_at: null,
    });
    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/resources');
  return { success: true, completed: Boolean(completedAt) };
}
