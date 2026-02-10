// Admin Service - User Management
// TODO: Connect to Supabase Admin API when admin panel is implemented

import { supabaseAdmin } from '@/lib/platform/supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export class AdminService {
  async listUsers(page: number, perPage: number): Promise<AdminUser[]> {
    try {
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
        page: page,
        perPage: perPage
      });

      if (error) {
        console.error('Error listing users:', error);
        return [];
      }

      return users.map(u => ({
        id: u.id,
        email: u.email || '',
        role: (u.app_metadata?.role as string) || (u.user_metadata?.role as string) || 'user',
        created_at: u.created_at
      }));
    } catch {
      return [];
    }
  }

  async updateUserRole(
    userId: string,
    role: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        app_metadata: { role }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: message };
    }
  }
}

// Singleton instance
let adminServiceInstance: AdminService | null = null;

export const getAdminService = (): AdminService => {
  if (!adminServiceInstance) {
    adminServiceInstance = new AdminService();
  }
  return adminServiceInstance;
};
