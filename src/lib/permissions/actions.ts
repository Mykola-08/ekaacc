'use server';

import { createClient } from '@/lib/supabase/server';
import { getUserPermissions as getPermissionsByUserId } from '@/lib/platform/utils/auth-utils';

/**
 * Get permissions for the currently authenticated user.
 * Designed to be called from Server Components without passing a userId.
 */
export async function getUserPermissions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  return getPermissionsByUserId(user.id);
}
