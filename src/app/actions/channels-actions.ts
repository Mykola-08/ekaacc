'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getMyChannels() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('channels')
    .select('*, channel_members!inner(user_id, role)')
    .eq('channel_members.user_id', user.id)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false });

  return { data: data ?? [], error: error?.message ?? null };
}

export async function getPublicChannels() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('channels')
    .select('id, name, description, type, created_at')
    .eq('is_archived', false)
    .eq('type', 'group')
    .order('created_at', { ascending: false })
    .limit(20);

  return { data: data ?? [], error: error?.message ?? null };
}

export async function getChannelMessages(channelId: string, limit = 50) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('channel_messages')
    .select('id, content, type, created_at, sender_id, sender:sender_id(full_name, avatar_url)')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true })
    .limit(limit);

  return { data: data ?? [], error: error?.message ?? null };
}

export async function sendChannelMessage(channelId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('channel_messages')
    .insert({ channel_id: channelId, sender_id: user.id, content: content.trim(), type: 'text' })
    .select('id, content, type, created_at, sender_id')
    .single();

  if (error) return { success: false, error: error.message };

  // Update channel updated_at
  await supabase
    .from('channels')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', channelId);

  revalidatePath('/chat');
  return { success: true, data };
}

export async function createChannel(input: {
  name: string;
  description?: string;
  type?: 'group' | 'announcement';
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { data: channel, error } = await supabase
    .from('channels')
    .insert({ ...input, type: input.type ?? 'group', created_by: user.id })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // Auto-join as owner
  await supabase
    .from('channel_members')
    .insert({ channel_id: channel.id, user_id: user.id, role: 'owner' });

  revalidatePath('/chat');
  return { success: true, data: channel };
}

export async function joinChannel(channelId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('channel_members')
    .upsert({ channel_id: channelId, user_id: user.id, role: 'member' });

  if (error) return { success: false, error: error.message };
  revalidatePath('/chat');
  return { success: true };
}

export async function editChannelMessage(messageId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('channel_messages')
    .update({ content: content.trim(), updated_at: new Date().toISOString() })
    .eq('id', messageId)
    .eq('sender_id', user.id); // only own messages

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteChannelMessage(messageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('channel_messages')
    .delete()
    .eq('id', messageId)
    .eq('sender_id', user.id); // only own messages

  if (error) return { success: false, error: error.message };
  return { success: true };
}
