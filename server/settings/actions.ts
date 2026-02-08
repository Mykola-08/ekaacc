'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache'; // Correct import!
import { z } from 'zod';

const ProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email().optional(), // Usually managed by Auth, but maybe contact email
  phone: z.string().optional(),
  bio: z.string().max(500).optional(), // Assuming bio exists
});

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  const rawData = {
    full_name: formData.get('full_name') as string,
    phone: formData.get('phone') as string,
    bio: formData.get('bio') as string,
  };

  const validated = ProfileSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // 1. Update Profile Table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: validated.data.full_name,
        // We assume phone/bio exist in profiles, or metadata jsonb
        // Let's safe update only known fields. If schema differs, we might need to adjust.
        // For now, let's update full_name and store phone/bio in a 'metadata' column if it exists,
        // or just try to update them if we are sure.
        // Given I don't see the schema, I'll assume standard columns or put extras in metadata.
        metadata: { phone: validated.data.phone, bio: validated.data.bio },
      })
      .eq('auth_id', user.id);

    if (profileError) throw profileError;

    revalidatePath('/settings');
    revalidatePath('/profile');

    return { success: true, message: 'Profile updated successfully' };
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    return { success: false, message: 'Failed to update profile: ' + error.message };
  }
}

export async function getUserSettings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  return profile;
}
