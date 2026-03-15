'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateTenantFeatures(features: Record<string, boolean>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Get user role and tenant
  const { data: userData } = await supabase
    .from('users')
    .select('role, tenant_id')
    .eq('id', user.id)
    .single();

  if (!userData || userData.role !== 'therapist') {
    throw new Error('Unauthorized: Only therapists can update workspace settings');
  }

  const tenantId = userData.tenant_id || 'default';

  // Upsert the tenant features
  const { error } = await supabase.from('tenant_features').upsert(
    {
      tenant_id: tenantId,
      features: features,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'tenant_id' }
  );

  if (error) {
    console.error('Error updating tenant features', error);
    throw new Error('Failed to update workspace features');
  }

  revalidatePath('/', 'layout'); // revalidate layout out entirely to re-run resolveFeatures
  return { success: true };
}
