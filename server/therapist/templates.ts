'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface SessionTemplate {
  id: string;
  therapist_id: string;
  name: string;
  content: any;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getTemplates() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('session_templates')
    .select('*')
    .eq('therapist_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }

  return data as SessionTemplate[];
}

export async function createTemplate(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const contentRaw = formData.get('content') as string;
  const type = (formData.get('type') as string) || 'note';

  let content = {};
  try {
    content = JSON.parse(contentRaw);
  } catch (e) {
    // If not JSON, store as simple text in a value field
    content = { value: contentRaw };
  }

  const { error } = await supabase.from('session_templates').insert({
    therapist_id: user.id,
    name,
    content,
    type,
  });

  if (error) {
    console.error('Error creating template:', error);
    throw error;
  }

  revalidatePath('/therapist/templates');
}

export async function updateTemplate(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const contentRaw = formData.get('content') as string;

  let content = {};
  try {
    content = JSON.parse(contentRaw);
  } catch (e) {
    content = { value: contentRaw };
  }

  const { error } = await supabase
    .from('session_templates')
    .update({
      name,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('therapist_id', user.id);

  if (error) {
    console.error('Error updating template:', error);
    throw error;
  }

  revalidatePath('/therapist/templates');
}

export async function deleteTemplate(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('session_templates')
    .delete()
    .eq('id', id)
    .eq('therapist_id', user.id);

  if (error) {
    console.error('Error deleting template:', error);
    throw error;
  }

  revalidatePath('/therapist/templates');
}
