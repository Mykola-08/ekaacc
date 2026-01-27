
import { createClient } from '@/lib/supabase/server';

export interface DependentProfile {
  name: string;
  dob?: string;
  notes?: string;
  avatarUrl?: string;
}

export class FamilyService {
  
  /**
   * Add a dependent (child/senior) to a user's account
   * Currently supports "Managed" dependents (no separate login)
   */
  async addDependent(guardianId: string, profile: DependentProfile, type: 'child' | 'dependent' = 'child') {
    const supabase = await createClient();
    
    // In a real app, we might create a full 'auth.users' shadow record or 'guest' record.
    // For now, storing in metadata is sufficient for booking linkage.
    const { data, error } = await supabase
      .from('user_relationship')
      .insert({
        guardian_id: guardianId,
        type: type,
        metadata: profile
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get all people this user manages
   */
  async getDependents(guardianId: string) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('user_relationship')
      .select('*')
      .eq('guardian_id', guardianId);
      
    return data?.map(rel => ({
      id: rel.id,
      type: rel.type,
      ...rel.metadata // Flatten metadata for UI
    })) || [];
  }
}
