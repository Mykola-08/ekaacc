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
  const userId = formData.get('user_id') as string;
  const dueDate = formData.get('due_date') as string;

  if (!title || !userId || !dueDate) return { error: 'Title, patient, and due date are required' };

  const { error } = await supabase.from('assignments').insert({
    title,
    description,
    user_id: userId,
    assigned_by: user.id,
    due_date: dueDate,
    status: 'pending',
  });

  if (error) return { error: error.message };
  revalidatePath('/therapist/assignments');
  return { success: true };
}

export async function updateAssignment(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const dueDate = formData.get('due_date') as string;
  const status = formData.get('status') as string;

  if (!id || !title) return { error: 'Missing required fields' };

  const updates: Record<string, unknown> = { title, description };
  if (dueDate) updates.due_date = dueDate;
  if (status) updates.status = status;

  const { error } = await supabase.from('assignments').update(updates).eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/therapist/assignments');
  return { success: true };
}
