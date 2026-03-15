'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const FamilyMemberSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  dob: z.string().optional(), // YYYY-MM-DD
  relationship: z.string().min(1, 'Relationship is required'),
});

export async function getFamilyMembers() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // 1. Get the current user's profile ID
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!userProfile) {
    console.error('No profile found for user:', user.id);
    return [];
  }

  // 2. Fetch family members (profiles managed by this user)
  const { data: members, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('managed_by', userProfile.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching family:', error);
    return [];
  }

  return members;
}

export async function addFamilyMember(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  // Get current user's profile
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!userProfile) {
    return { success: false, message: 'Profile not found' };
  }

  const rawData = {
    full_name: formData.get('full_name'),
    dob: formData.get('dob'),
    relationship: formData.get('relationship'),
  };

  const validated = FamilyMemberSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Create a new managed profile
    const { error } = await supabase.from('profiles').insert({
      full_name: validated.data.full_name,
      dob: validated.data.dob || null,
      managed_by: userProfile.id,
      metadata: { relationship: validated.data.relationship },
      role: 'client', // Default role
    });

    if (error) throw error;

    revalidatePath('/settings/family');
    return { success: true, message: 'Family member added' };
  } catch (e: any) {
    console.error('Add family error:', e);
    return { success: false, message: e.message };
  }
}

export async function deleteFamilyMember(memberId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Unauthorized' };

  // Get current user's profile
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!userProfile) return { success: false, message: 'Profile not found' };

  // Delete only if managed by the current user
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', memberId)
    .eq('managed_by', userProfile.id);

  if (error) return { success: false, message: error.message };

  revalidatePath('/settings/family');
  return { success: true };
}
