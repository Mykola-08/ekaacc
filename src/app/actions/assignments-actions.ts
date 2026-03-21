'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getMyAssignments(status?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Unauthenticated' };

  // Get profile to get the profile id
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  const query = supabase
    .from('assignments')
    .select('*, therapist:therapist_id(full_name, avatar_url)')
    .eq('patient_id', user.id)
    .order('due_date', { ascending: true, nullsFirst: false });

  if (status && status !== 'all') query.eq('status', status);

  const { data, error } = await query;
  return { data: data ?? [], error: error?.message ?? null };
}

export async function updateAssignmentStatus(id: string, status: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('assignments')
    .update({ status })
    .eq('id', id)
    .eq('patient_id', user.id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/assignments');
  return { success: true };
}

export async function submitAssignment(id: string, responseText: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  // Create submission
  const { error: subError } = await supabase.from('assignment_submissions').upsert({
    assignment_id: id,
    patient_id: user.id,
    response_json: { text: responseText },
    submitted_at: new Date().toISOString(),
  });

  if (subError) return { success: false, error: subError.message };

  // Update assignment status to submitted
  await supabase
    .from('assignments')
    .update({ status: 'submitted' })
    .eq('id', id)
    .eq('patient_id', user.id);

  revalidatePath('/assignments');
  return { success: true };
}

// Therapist: create assignment for a patient
export async function createAssignment(input: {
  patient_id: string;
  title: string;
  description?: string;
  type?: string;
  due_date?: string;
  priority?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('assignments')
    .insert({ ...input, therapist_id: user.id, status: 'pending' })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath('/assignments');
  revalidatePath('/therapist/clients');
  return { success: true, data };
}
