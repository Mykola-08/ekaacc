'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function requireAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, error: 'Unauthenticated' };

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (error) return { ok: false as const, error: error.message };
  if (!profile || profile.role !== 'admin') {
    return { ok: false as const, error: 'Forbidden: Admin access required' };
  }

  return { ok: true as const };
}

export async function getCommunityPosts(options?: { category?: string; limit?: number }) {
  const supabase = await createClient();

  const query = supabase
    .from('community_posts')
    .select('*, author:user_id(full_name, avatar_url)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(options?.limit ?? 20);

  if (options?.category) query.eq('category', options.category);

  const { data, error } = await query;
  return { data: data ?? [], error: error?.message ?? null };
}

export async function createCommunityPost(input: {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  is_anonymous?: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      ...input,
      user_id: user.id,
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath('/community');
  return { success: true, data };
}

export async function likePost(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase.rpc('increment_post_likes', { post_id: postId });

  if (error) {
    const { data: post, error: readError } = await supabase
      .from('community_posts')
      .select('likes_count')
      .eq('id', postId)
      .single();

    if (readError) return { success: false, error: readError.message };

    const currentLikes = post?.likes_count ?? 0;
    const { error: updateError } = await supabase
      .from('community_posts')
      .update({ likes_count: currentLikes + 1 })
      .eq('id', postId);

    if (updateError) return { success: false, error: updateError.message };
  }

  revalidatePath('/community');
  return { success: true };
}

export async function reactToPost(postId: string, reaction: 'like' | 'heart' | 'pray') {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { data: post, error: readError } = await supabase
    .from('community_posts')
    .select('reactions')
    .eq('id', postId)
    .single();

  if (readError) return { success: false, error: readError.message };

  const existing = ((post as any)?.reactions ?? { like: 0, heart: 0, pray: 0 }) as Record<
    string,
    number
  >;
  const next = {
    like: Number(existing.like ?? 0),
    heart: Number(existing.heart ?? 0),
    pray: Number(existing.pray ?? 0),
  };
  next[reaction] += 1;

  const { error: updateError } = await supabase
    .from('community_posts')
    .update({ reactions: next })
    .eq('id', postId);

  if (updateError) return { success: false, error: updateError.message };

  revalidatePath('/community');
  return { success: true, reactions: next };
}

export async function createReply(input: { parent_id: string; content: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      parent_id: input.parent_id,
      title: 'Reply',
      content: input.content,
      category: 'general',
      user_id: user.id,
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .select(
      'id, title, content, category, tags, likes_count, reactions, parent_id, is_anonymous, created_at, author:user_id(full_name, avatar_url)'
    )
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath('/community');
  return { success: true, data };
}

export async function reportCommunityPost(input: {
  post_id: string;
  reason: 'spam' | 'harassment' | 'misinformation' | 'unsafe' | 'other';
  details?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase.from('community_post_reports').insert({
    post_id: input.post_id,
    reported_by: user.id,
    reason: input.reason,
    details: input.details ?? null,
    status: 'open',
  });

  if (error) return { success: false, error: error.message };
  revalidatePath('/community');
  revalidatePath('/admin/community');
  return { success: true };
}

export async function updateCommunityReportStatus(input: {
  report_id: string;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
}) {
  const access = await requireAdminAccess();
  if (!access.ok) return { success: false, error: access.error };

  const supabase = await createClient();

  const updatePayload: Record<string, any> = { status: input.status };
  if (input.status === 'resolved' || input.status === 'dismissed') {
    updatePayload.resolved_at = new Date().toISOString();
  } else {
    updatePayload.resolved_at = null;
  }

  const { error } = await supabase
    .from('community_post_reports')
    .update(updatePayload)
    .eq('id', input.report_id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/community');
  return { success: true };
}
