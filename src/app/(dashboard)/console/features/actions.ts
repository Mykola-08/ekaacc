'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createFeature(formData: FormData) {
  const supabase = await createClient();
  const key = (formData.get('key') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const parentFeatureId = (formData.get('parent_feature_id') as string) || null;
  const defaultEnabled = formData.get('default_enabled') === 'on';

  if (!key) return { error: 'Feature key is required' };

  const { error } = await supabase.from('features').insert({
    key,
    description,
    parent_feature_id: parentFeatureId || null,
    default_enabled: defaultEnabled,
  });

  if (error) return { error: error.message };
  revalidatePath('/console/features');
  return { success: true };
}

export async function updateFeature(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;
  const key = (formData.get('key') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const defaultEnabled = formData.get('default_enabled') === 'on';

  if (!id || !key) return { error: 'Missing required fields' };

  const { error } = await supabase
    .from('features')
    .update({ key, description, default_enabled: defaultEnabled })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/console/features');
  return { success: true };
}

export async function deleteFeature(featureId: string) {
  const supabase = await createClient();
  await supabase.from('features').delete().eq('id', featureId);
  revalidatePath('/console/features');
  return { success: true };
}
