// Theme Service - User Theme Preferences
import { supabaseAdmin } from '@/lib/platform/supabase';
import type { Theme } from '@/lib/platform/types/subscription-types';

export interface IThemeService {
  getAllThemes(): Promise<Theme[]>;
  getUserThemePreference(userId: string): Promise<{ currentTheme: string } | null>;
  setUserTheme(userId: string, theme: string): Promise<{ success: boolean; error?: string }>;
}

const themeService: IThemeService = {
  getAllThemes: async (): Promise<Theme[]> => {
    try {
      const { data, error } = await supabaseAdmin.from('themes').select('*').eq('active', true);

      if (error) return [];
      return (data || []) as Theme[];
    } catch {
      return [];
    }
  },

  getUserThemePreference: async (userId: string): Promise<{ currentTheme: string } | null> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_preferences')
        .select('theme')
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;
      return { currentTheme: data.theme || 'default' };
    } catch {
      return null;
    }
  },

  setUserTheme: async (
    userId: string,
    theme: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabaseAdmin
        .from('user_preferences')
        .upsert(
          { user_id: userId, theme, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: message };
    }
  },
};

export const getThemeService = async (): Promise<IThemeService> => themeService;
