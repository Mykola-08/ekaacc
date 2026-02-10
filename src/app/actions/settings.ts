'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NotificationPreferences {
  email_updates: boolean;
  push_notifications: boolean;
  appointment_reminders: boolean;
  marketing_emails: boolean;
  sms_notifications: boolean;
  wellness_tips: boolean;
}

export interface UserPreferences {
  public_profile: boolean;
  share_goals: boolean;
  language: string;
  timezone: string;
}

// ─── Profile Update ───────────────────────────────────────────────────────────

const ProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  bio: z.string().max(500).optional(),
});

export async function saveProfile(data: {
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  bio?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const validated = ProfileSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Update auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: validated.data.full_name,
        phone: validated.data.phone,
        date_of_birth: validated.data.date_of_birth,
        bio: validated.data.bio,
      },
    });

    if (authError) throw authError;

    // Also update user_profiles if it exists
    await supabase
      .from('user_profiles')
      .upsert(
        {
          id: user.id,
          full_name: validated.data.full_name,
          phone: validated.data.phone,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    revalidatePath('/settings');
    revalidatePath('/profile');
    return { success: true };
  } catch (err: any) {
    console.error('saveProfile error:', err);
    return { success: false, error: err.message || 'Failed to update profile' };
  }
}

// ─── Avatar Upload ────────────────────────────────────────────────────────────

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const file = formData.get('avatar') as File;
  if (!file || file.size === 0) {
    return { success: false, error: 'No file provided' };
  }

  // Validate file type and size
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Only JPG, PNG and WebP images are allowed' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'Image must be under 5MB' };
  }

  try {
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `avatars/${user.id}/avatar.${ext}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    // Update user metadata with avatar URL
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: avatarUrl },
    });

    if (updateError) throw updateError;

    revalidatePath('/settings');
    revalidatePath('/profile');
    return { success: true, avatarUrl };
  } catch (err: any) {
    console.error('uploadAvatar error:', err);
    return { success: false, error: err.message || 'Failed to upload avatar' };
  }
}

// ─── Password Reset ──────────────────────────────────────────────────────────

export async function sendPasswordResetEmail() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { success: false, error: 'No email found for this account' };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:9002'}/auth/update-password`,
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('sendPasswordResetEmail error:', err);
    return { success: false, error: err.message || 'Failed to send reset email' };
  }
}

// ─── Notification Preferences ─────────────────────────────────────────────────

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      email_updates: true,
      push_notifications: false,
      appointment_reminders: true,
      marketing_emails: false,
      sms_notifications: false,
      wellness_tips: true,
    };
  }

  // Try to fetch from notification_preferences table
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    // Return defaults from user metadata or fallback
    const meta = user.user_metadata?.notification_preferences;
    return {
      email_updates: meta?.email_updates ?? true,
      push_notifications: meta?.push_notifications ?? false,
      appointment_reminders: meta?.appointment_reminders ?? true,
      marketing_emails: meta?.marketing_emails ?? false,
      sms_notifications: meta?.sms_notifications ?? false,
      wellness_tips: meta?.wellness_tips ?? true,
    };
  }

  return {
    email_updates: data.email_updates ?? true,
    push_notifications: data.push_notifications ?? false,
    appointment_reminders: data.appointment_reminders ?? true,
    marketing_emails: data.marketing_emails ?? false,
    sms_notifications: data.sms_notifications ?? false,
    wellness_tips: data.wellness_tips ?? true,
  };
}

export async function saveNotificationPreferences(prefs: NotificationPreferences) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Try to save to notification_preferences table
    const { error: dbError } = await supabase
      .from('notification_preferences')
      .upsert(
        {
          user_id: user.id,
          ...prefs,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (dbError) {
      // Fallback: save to user metadata
      const { error: metaError } = await supabase.auth.updateUser({
        data: { notification_preferences: prefs },
      });
      if (metaError) throw metaError;
    }

    revalidatePath('/settings');
    return { success: true };
  } catch (err: any) {
    console.error('saveNotificationPreferences error:', err);
    return { success: false, error: err.message || 'Failed to save preferences' };
  }
}

// ─── User Preferences ─────────────────────────────────────────────────────────

export async function getUserPreferences(): Promise<UserPreferences> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { public_profile: false, share_goals: false, language: 'en', timezone: 'Europe/Dublin' };
  }

  const meta = user.user_metadata?.preferences;
  return {
    public_profile: meta?.public_profile ?? false,
    share_goals: meta?.share_goals ?? false,
    language: meta?.language ?? 'en',
    timezone: meta?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export async function saveUserPreferences(prefs: UserPreferences) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      data: { preferences: prefs },
    });

    if (error) throw error;

    revalidatePath('/settings');
    return { success: true };
  } catch (err: any) {
    console.error('saveUserPreferences error:', err);
    return { success: false, error: err.message || 'Failed to save preferences' };
  }
}

// ─── Delete Account ───────────────────────────────────────────────────────────

export async function requestAccountDeletion() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Mark account for deletion (soft delete, admin handles final deletion)
    await supabase
      .from('user_profiles')
      .update({
        deletion_requested_at: new Date().toISOString(),
        status: 'pending_deletion',
      })
      .eq('id', user.id);

    // Also store in metadata for the auth layer
    await supabase.auth.updateUser({
      data: { deletion_requested: true, deletion_requested_at: new Date().toISOString() },
    });

    return { success: true };
  } catch (err: any) {
    console.error('requestAccountDeletion error:', err);
    return { success: false, error: err.message || 'Failed to request deletion' };
  }
}
