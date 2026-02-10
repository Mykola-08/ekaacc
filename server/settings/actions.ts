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
    // 1. Update Auth Metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: validated.data.full_name,
        phone: validated.data.phone,
        bio: validated.data.bio,
      }
    });

    if (updateError) throw updateError;

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

  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    full_name: user.user_metadata?.full_name,
    phone: user.user_metadata?.phone,
    bio: user.user_metadata?.bio,
    ...user.user_metadata
  };
}
