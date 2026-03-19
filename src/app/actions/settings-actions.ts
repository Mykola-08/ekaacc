'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateIdentitySettings(input: {
  full_name?: string;
  phone?: string;
  date_of_birth?: string | null;
  nationality?: string | null;
  preferred_language?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthenticated' };

  const payload = {
    ...input,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('profiles').update(payload).eq('auth_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/settings/identity');
  revalidatePath('/settings');
  return { success: true };
}

export async function getFamilyLinks() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: [], error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('family_links')
    .select('id, linked_email, relationship, status, created_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function addFamilyLink(input: { linked_email: string; relationship: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase.from('family_links').insert({
    owner_id: user.id,
    linked_email: input.linked_email,
    relationship: input.relationship,
    status: 'pending',
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/settings/family');
  return { success: true };
}

export async function getReferralOverview() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { code: null, count: 0, error: 'Unauthenticated' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, referral_code')
    .eq('auth_id', user.id)
    .single();

  const fallbackCode = user.id.replace(/-/g, '').slice(0, 8).toUpperCase();
  const code = (profile as any)?.referral_code ?? fallbackCode;

  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .or(`referred_by.eq.${code},referred_by.eq.${user.id}`);

  return {
    code,
    count: count ?? 0,
    error: null,
  };
}
