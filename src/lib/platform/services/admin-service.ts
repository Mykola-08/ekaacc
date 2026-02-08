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
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, email, role, created_at')
        .range((page - 1) * perPage, page * perPage - 1);

      if (error) {
        console.error('Error listing users:', error);
        return [];
      }

      return (data || []) as AdminUser[];
    } catch {
      return [];
    }
  }

  async updateUserRole(
    userId: string,
    role: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseAdmin.from('profiles').update({ role }).eq('id', userId);

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
