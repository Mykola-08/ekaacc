'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createAssignment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  // `user_id` is the select name in the form (patient select)
  const patientAuthId = formData.get('user_id') as string;
  const dueDate = formData.get('due_date') as string;
  const type = (formData.get('type') as string) || 'exercise';

  if (!title || !patientAuthId || !dueDate) {
    return { error: 'Title, patient, and due date are required' };
  }

  const { error } = await supabase.from('assignments').insert({
    title,
    description,
    patient_id: patientAuthId, // auth.users(id) reference
    therapist_id: user.id,     // auth.users(id) reference
    due_date: dueDate,
    type,
    status: 'pending',
  });

  if (error) return { error: error.message };
  revalidatePath('/therapist/assignments');
  return { success: true };
}

export async function updateAssignment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const id = formData.get('id') as string;
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const dueDate = formData.get('due_date') as string;
  const status = formData.get('status') as string;

  if (!id || !title) return { error: 'Missing required fields' };

  const updates: Record<string, unknown> = { title, description };
  if (dueDate) updates.due_date = dueDate;
  if (status) updates.status = status;

  const { error } = await supabase
    .from('assignments')
    .update(updates)
    .eq('id', id)
    .eq('therapist_id', user.id); // only therapist who created can update

  if (error) return { error: error.message };
  revalidatePath('/therapist/assignments');
  return { success: true };
}

export async function deleteAssignment(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('id', id)
    .eq('therapist_id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/therapist/assignments');
  return { success: true };
}
