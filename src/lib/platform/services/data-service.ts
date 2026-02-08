// Data Service - Generic Data Access
import { supabaseAdmin } from '@/lib/platform/supabase';

export interface DataUser {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  therapist_id?: string;
  status: string;
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  type: string;
  data: Record<string, unknown>;
  created_at: string;
}

export interface Donation {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
}

const dataService = {
  getAllUsers: async (): Promise<DataUser[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, email, name, created_at')
        .order('created_at', { ascending: false });

      if (error) return [];
      return (data || []) as DataUser[];
    } catch {
      return [];
    }
  },

  getSessions: async (userId?: string): Promise<Session[]> => {
    try {
      let query = supabaseAdmin
        .from('sessions')
        .select('id, user_id, therapist_id, status, created_at')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) return [];
      return (data || []) as Session[];
    } catch {
      return [];
    }
  },

  getReports: async (userId?: string): Promise<Report[]> => {
    try {
      let query = supabaseAdmin
        .from('reports')
        .select('id, user_id, type, data, created_at')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) return [];
      return (data || []) as Report[];
    } catch {
      return [];
    }
  },

  getDonations: async (userId: string): Promise<Donation[]> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('donations')
        .select('id, user_id, amount, status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return [];
      return (data || []) as Donation[];
    } catch {
      return [];
    }
  },

  updateUser: async (
    userId: string,
    data: Partial<DataUser>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabaseAdmin.from('profiles').update(data).eq('id', userId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: message };
    }
  },
};

export const getDataService = async () => dataService;
