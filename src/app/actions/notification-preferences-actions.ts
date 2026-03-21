'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type NotifPrefsInput = {
  email_enabled?: boolean;
  push_enabled?: boolean;
  in_app_enabled?: boolean;
  telegram_enabled?: boolean;
  booking_reminders?: boolean;
  booking_changes?: boolean;
  assignment_due?: boolean;
  assignment_reviewed?: boolean;
  ai_insights_weekly?: boolean;
  goal_nudges?: boolean;
  community_mentions?: boolean;
  payment_receipts?: boolean;
  system_updates?: boolean;
  digest_frequency?: string;
};

export async function updateNotificationPreferences(
  input: NotifPrefsInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('notification_preferences')
    .upsert({ user_id: user.id, ...input }, { onConflict: 'user_id' });

  if (error) return { success: false, error: error.message };

  revalidatePath('/settings');
  return { success: true };
}

export async function getNotificationPreferences() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return data;
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('is_read', false);

  revalidatePath('/notifications');
  return { success: !error };
}
