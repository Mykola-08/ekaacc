'use server';

import { AdminService } from '@/lib/platform/services/admin-service';
import { revalidatePath } from 'next/cache';

const adminService = new AdminService();

export async function listUsers(page: number = 1, perPage: number = 50) {
  // In a real app, verify the current user is an Admin here
  try {
    const users = await adminService.listUsers(page, perPage);
    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(userId: string, role: string) {
  // In a real app, verify the current user is an Admin here
  try {
    await adminService.updateUserRole(userId, role);
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
