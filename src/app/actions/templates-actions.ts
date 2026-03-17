'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSessionTemplates() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('session_templates')
    .select('*')
    .eq('therapist_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return { data: data ?? [], error: error?.message ?? null };
}

export async function createSessionTemplate(input: {
  name: string;
  content: Record<string, any>;
  type?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('session_templates')
    .insert({ ...input, therapist_id: user.id, type: input.type ?? 'note' })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath('/therapist/templates');
  return { success: true, data };
}

export async function updateSessionTemplate(
  id: string,
  input: { name?: string; content?: Record<string, any>; type?: string }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('session_templates')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('therapist_id', user.id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/therapist/templates');
  return { success: true };
}

export async function deleteSessionTemplate(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('session_templates')
    .update({ is_active: false })
    .eq('id', id)
    .eq('therapist_id', user.id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/therapist/templates');
  return { success: true };
}
