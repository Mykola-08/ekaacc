'use server';

import { AdminService } from '@/lib/platform/services/admin-service';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const adminService = new AdminService();

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  return user;
}

export async function listUsers(page: number = 1, perPage: number = 50) {
  try {
    await requireAdmin();
    const users = await adminService.listUsers(page, perPage);
    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    await requireAdmin();
    await adminService.updateUserRole(userId, role);
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
