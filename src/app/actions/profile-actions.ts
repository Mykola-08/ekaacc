'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getMyProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  return { data, error: error?.message ?? null };
}

export async function updateProfile(input: {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
  specialties?: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('profiles')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('auth_id', user.id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/profile');
  revalidatePath('/settings');
  return { success: true };
}
