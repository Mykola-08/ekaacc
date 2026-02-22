'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const purchaseSchema = z.object({
  userId: z.string().uuid(),
  itemName: z.string().min(1),
  source: z.string().min(1),
  status: z.string().default('ordered')
});

export async function logExternalPurchase(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    userId: formData.get('userId'),
    itemName: formData.get('itemName'),
    source: formData.get('source'),
    status: formData.get('status') || 'ordered'
  };

  const validated = purchaseSchema.safeParse(rawData);
  if (!validated.success) {
    return { message: 'Invalid data', errors: validated.error.flatten() };
  }

  const { error } = await supabase.from('external_purchases').insert({
    user_id: validated.data.userId,
    item_name: validated.data.itemName,
    source: validated.data.source,
    status: validated.data.status,
    // created_by is handled by RLS or default if set
  });

  if (error) return { message: error.message };

  revalidatePath(`/admin/users/${validated.data.userId}`);
  return { message: 'Success' };
}

export async function toggleFeatureOverride(userId: string, featureId: string, enabled: boolean) {
  const supabase = await createClient();

  // Check if enrollment exists
  const { data: existing } = await supabase
    .from('feature_enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('feature_id', featureId)
    .single();

  if (existing) {
    await supabase.from('feature_enrollments').update({ enabled }).eq('id', existing.id);
  } else {
    await supabase.from('feature_enrollments').insert({
      user_id: userId,
      feature_id: featureId,
      enabled
    });
  }

  revalidatePath(`/admin/users/${userId}`);
}
