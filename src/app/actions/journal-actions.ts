'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getJournalEntries(limit = 20) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, title, content, mood, mood_score, tags, created_at, updated_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data: data ?? [], error: error?.message ?? null };
}

export async function createJournalEntry(input: {
  title?: string;
  content: string;
  mood?: string;
  mood_score?: number;
  tags?: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath('/journal');
  return { success: true, data };
}

export async function updateJournalEntry(
  id: string,
  input: { title?: string; content?: string; mood?: string; mood_score?: number; tags?: string[] }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('journal_entries')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/journal');
  return { success: true };
}

export async function deleteJournalEntry(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/journal');
  return { success: true };
}
