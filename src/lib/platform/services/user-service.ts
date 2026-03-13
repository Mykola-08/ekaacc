// Production-grade users service with Supabase integration
import { supabase } from '@/lib/platform/supabase';
import { safeSupabaseUpdate, safeSupabaseQuery } from '@/lib/platform/supabase/utils';

export const userService = {
  async getUsers() {
    try {
      // Use 'profiles' table which is the active table (user_profiles is deprecated/empty)
      const { data, error } = await safeSupabaseQuery<any[]>(
        supabase
          .from('profiles')
          .select(
            `
            id,
            full_name,
            email,
            role,
            created_at,
            updated_at
          `
          )
          .order('created_at', { ascending: false })
      );

      if (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
      }

      // Normalize shape: map full_name -> name, format role object
      return (data || []).map((u: any) => ({
        ...u,
        name: u.full_name || '',
        // UI expects role as an object with name property
        role: u.role ? { name: u.role } : null,
      }));
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
  },

  async updateUserRole(userId: string, roleName: string) {
    try {
      // 'profiles' table has a direct 'role' column (enum or text)
      // Check if the role is valid or map it if necessary.
      // Assuming roleName corresponds to the values used in the db (admin, therapist, client)

      const { data, error } = await safeSupabaseUpdate<any>(
        'profiles',
        { role: roleName },
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
      // Map common field names to profiles columns
      const profileUpdates: Record<string, any> = {};

      if (updates.name) profileUpdates.full_name = updates.name;
      // 'username', 'avatar_url', 'bio' are not standard columns in the new 'profiles' table locally.
      // If we need to support them, we might need to assume they are in metadata or add columns.
      // For now, only full_name is mapped from 'name'.

      if (Object.keys(profileUpdates).length === 0) {
        return null; // Nothing to update
      }

      const { data, error } = await safeSupabaseUpdate<any>('profiles', profileUpdates, {
        id: userId,
      });

      if (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user');
      }

      return data;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  },

  async deleteUser(userId: string) {
    try {
      // For GDPR, we often need to delete from auth.users (requires service role)
      // and let cascading deletes handle profiles, or scrub the profile.
      // Here, we'll try to delete from public profiles and handle errors.

      // Attempting to delete from public profiles
      const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw new Error('Failed to delete user profile data');
      }

      // To fully delete from auth, we'd need to call an admin function
      // If using an Edge Function for auth deletion:
      // await supabase.functions.invoke('delete-user', { body: { userId } });

      return { success: true };
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  },
};

export default userService;
