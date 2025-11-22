import { createClient } from '@supabase/supabase-js';

export interface Feature {
  id: string;
  key: string;
  name: string;
  description: string;
  status: 'alpha' | 'beta' | 'stable' | 'deprecated';
  isEnabled: boolean;
  minRole: string;
}

export class FeatureService {
  private supabase: any;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Check if a feature is enabled for a user
   */
  async isFeatureEnabled(userId: string, featureKey: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.rpc('is_feature_enabled', {
        user_id: userId,
        feature_key: featureKey
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error checking feature ${featureKey}:`, error);
      return false;
    }
  }

  /**
   * Enroll user in a program (alpha/beta)
   */
  async enrollInProgram(userId: string, program: 'alpha' | 'beta'): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('user_feature_enrollment')
        .upsert({ user_id: userId, program });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error enrolling in ${program}:`, error);
      return false;
    }
  }

  /**
   * Unenroll user from a program
   */
  async unenrollFromProgram(userId: string, program: 'alpha' | 'beta'): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('user_feature_enrollment')
        .delete()
        .match({ user_id: userId, program });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error unenrolling from ${program}:`, error);
      return false;
    }
  }

  /**
   * Get all features available to the user
   */
  async getAvailableFeatures(userId: string): Promise<Feature[]> {
    try {
      // This is a simplified check. For a real list, we might want to call is_feature_enabled for each,
      // or create a bulk RPC function. For now, let's just list all enabled features and filter client-side or assume visibility.
      // Actually, let's just return all features and let the UI decide based on status/enrollment.
      
      const { data: features, error } = await this.supabase
        .from('features')
        .select('*')
        .eq('is_enabled', true);

      if (error) throw error;
      
      // We should ideally filter this list based on user's enrollment and role, 
      // but for now returning the list allows the UI to show "Join Beta to use this"
      return features.map((f: any) => ({
        id: f.id,
        key: f.key,
        name: f.name,
        description: f.description,
        status: f.status,
        isEnabled: f.is_enabled,
        minRole: f.min_role
      }));
    } catch (error) {
      console.error('Error fetching features:', error);
      return [];
    }
  }
  
  /**
   * Get user enrollments
   */
  async getUserEnrollments(userId: string): Promise<string[]> {
      try {
          const { data, error } = await this.supabase
            .from('user_feature_enrollment')
            .select('program')
            .eq('user_id', userId);
            
          if (error) throw error;
          return data.map((d: any) => d.program);
      } catch (error) {
          console.error('Error fetching enrollments:', error);
          return [];
      }
  }

  /**
   * Get comprehensive user capabilities (features + permissions)
   */
  async getUserCapabilities(userId: string) {
    try {
      // Get enabled features
      const features = await this.getAvailableFeatures(userId);
      const enabledFeatures = [];
      
      for (const feature of features) {
        if (await this.isFeatureEnabled(userId, feature.key)) {
          enabledFeatures.push(feature.key);
        }
      }

      // Get permissions (using RPC would be better for bulk, but for now we can fetch role and custom perms)
      // Let's use a new RPC function for this to be efficient
      const { data: permissions, error } = await this.supabase.rpc('get_user_permissions', { user_id: userId });
      
      if (error) {
          // Fallback if RPC doesn't exist yet (I need to add it)
          console.warn('get_user_permissions RPC failed, returning empty permissions');
          return { features: enabledFeatures, permissions: [] };
      }

      return {
        features: enabledFeatures,
        permissions: permissions || []
      };
    } catch (error) {
      console.error('Error getting user capabilities:', error);
      return { features: [], permissions: [] };
    }
  }

  /**
   * Get public features (for unauthenticated users)
   */
  async getPublicFeatures(): Promise<Feature[]> {
    try {
      const { data: features, error } = await this.supabase
        .from('features')
        .select('*')
        .eq('is_enabled', true);

      if (error) throw error;

      return features.map((f: any) => ({
        id: f.id,
        key: f.key,
        name: f.name,
        description: f.description,
        status: f.status,
        isEnabled: f.is_enabled,
        minRole: f.min_role
      }));
    } catch (error) {
      console.error('Error fetching public features:', error);
      return [];
    }
  }
}
