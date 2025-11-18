// Production-grade notifications service with Supabase integration
import { supabase } from '@/lib/supabase';
import { safeSupabaseInsert, safeSupabaseUpdate, safeSupabaseQuery } from '@/lib/supabase-utils';

export const fxNotifications = {
  async listNotifications() {
    try {
      const { data, error } = await safeSupabaseQuery<any[]>(
        supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
      );
      
      if (error) {
        // Suppress console error since we handle fallback in UI
        throw new Error('Failed to fetch notifications');
      }
      
      return data || [];
    } catch (error) {
      // Suppress console error since we handle fallback in UI
      throw error;
    }
  },
  async createNotification(n: { userId?: string; title: string; body?: string; type?: string }) {
    try {
      const { data, error } = await safeSupabaseInsert<any>(
        'notifications', {
          user_id: n.userId,
          title: n.title,
          body: n.body,
          type: n.type || 'system',
          is_read: false,
          seen: false,
          created_at: new Date().toISOString()
        }
      );
      
      if (error) {
        console.error('Error creating notification:', error);
        throw new Error('Failed to create notification');
      }
      
      return data;
    } catch (error) {
      console.error('Error in createNotification:', error);
      throw error;
    }
  },
  async markSeen(id: string) {
    try {
      const { data, error } = await safeSupabaseUpdate<any>(
        'notifications', 
        { seen: true, seen_at: new Date().toISOString() }, 
        { id }
      );
      
      if (error) {
        console.error('Error marking notification as seen:', error);
        throw new Error('Failed to mark notification as seen');
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in markSeen:', error);
      throw error;
    }
  }
};

export default fxNotifications;
