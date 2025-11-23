import { createClient } from '@supabase/supabase-js';

export class AdminService {
  private supabaseAdmin: any;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseServiceKey) {
        console.warn('AdminService: SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations will fail.');
    }

    this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  /**
   * Get all users (paginated)
   */
  async listUsers(page: number = 1, perPage: number = 20) {
    try {
      const { data: { users }, error } = await this.supabaseAdmin.auth.admin.listUsers({
        page,
        perPage
      });

      if (error) throw error;
      return users;
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: string) {
    try {
      const { data, error } = await this.supabaseAdmin.auth.admin.updateUserById(
        userId,
        { user_metadata: { role } }
      );

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Create a new feature flag
   */
  async createFeature(feature: { key: string; name: string; description?: string; status?: string; minRole?: string }) {
    try {
      const { data, error } = await this.supabaseAdmin
        .from('features')
        .insert(feature)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating feature:', error);
      throw error;
    }
  }

  /**
   * Update feature status
   */
  async updateFeatureStatus(key: string, status: 'alpha' | 'beta' | 'stable' | 'deprecated', isEnabled: boolean) {
    try {
      const { data, error } = await this.supabaseAdmin
        .from('features')
        .update({ status, is_enabled: isEnabled })
        .eq('key', key)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating feature:', error);
      throw error;
    }
  }

  /**
   * Override feature for a specific user
   */
  async overrideFeatureForUser(userId: string, featureKey: string, isEnabled: boolean) {
    try {
      const { data, error } = await this.supabaseAdmin
        .from('user_feature_overrides')
        .upsert({ user_id: userId, feature_key: featureKey, is_enabled: isEnabled })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error overriding feature:', error);
      throw error;
    }
  }

  /**
   * Grant custom permission to user
   */
  async grantPermission(userId: string, permissionKey: string) {
    try {
      const { data, error } = await this.supabaseAdmin
        .from('user_custom_permissions')
        .upsert({ user_id: userId, permission_key: permissionKey, is_granted: true })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error granting permission:', error);
      throw error;
    }
  }

  /**
   * Revoke custom permission from user
   */
  async revokePermission(userId: string, permissionKey: string) {
    try {
      const { data, error } = await this.supabaseAdmin
        .from('user_custom_permissions')
        .upsert({ user_id: userId, permission_key: permissionKey, is_granted: false })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error revoking permission:', error);
      throw error;
    }
  }
  
  /**
   * Create a new permission
   */
  async createPermission(key: string, name: string, description?: string) {
      try {
          const { data, error } = await this.supabaseAdmin
            .from('permissions')
            .insert({ key, name, description })
            .select()
            .single();
            
          if (error) throw error;
          return data;
      } catch (error) {
          console.error('Error creating permission:', error);
          throw error;
      }
  }
  
  /**
   * Assign permission to role
   */
  async assignPermissionToRole(role: string, permissionKey: string) {
      try {
          const { data, error } = await this.supabaseAdmin
            .from('role_permissions')
            .insert({ role, permission_key: permissionKey })
            .select()
            .single();
            
          if (error) throw error;
          return data;
      } catch (error) {
          console.error('Error assigning permission to role:', error);
          throw error;
      }
  }
}
