// Production-grade users service with Supabase integration
import { supabase } from '@/lib/supabase';
import { safeSupabaseUpdate, safeSupabaseQuery } from '@/lib/supabase-utils';

export const fxUsers = {
  async getUsers() {
    try {
      const { data, error } = await safeSupabaseQuery<any[]>(
        supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
      );
      
      if (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
  },
  async updateUserRole(userId: string, role: string) {
    try {
      const { data, error } = await safeSupabaseUpdate<any>(
        'users',
        { 
          profile_data: {
            // Preserve existing profile data while updating role
            role: role
          }
        },
        { id: userId }
      );
      
      if (error) {
        console.error('Error updating user role:', error);
        throw new Error('Failed to update user role');
      }
      
      return data;
    } catch (error) {
      console.error('Error in updateUserRole:', error);
      throw error;
    }
  },
  async updateUser(userId: string, updates: Record<string, any>) {
    try {
      const { data, error } = await safeSupabaseUpdate<any>(
        'users',
        updates,
        { id: userId }
      );
      
      if (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user');
      }
      
      return data;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }
};

export default fxUsers;
