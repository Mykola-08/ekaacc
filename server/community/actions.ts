'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters').max(5000),
  category: z.string().optional(),
  channelId: z.string().uuid().optional(),
});

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, profile: null, error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role')
    .eq('auth_id', user.id)
    .single();

  if (!profile) return { supabase, profile: null, error: 'Profile not found' };
  return { supabase, profile, error: null };
}

export async function createCommunityPost(input: z.infer<typeof CreatePostSchema>) {
  const { supabase, profile, error: authError } = await requireAuth();
  if (authError || !profile) return { success: false, error: authError };

  const validated = CreatePostSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Validation failed' };
  }

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      user_id: profile.id,
      title: validated.data.title,
      content: validated.data.content,
      category: validated.data.category || null,
      is_approved: true,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Failed to create post' };
  }

  revalidatePath('/community');
  return { success: true, postId: data.id };
}

export async function togglePostLike(postId: string) {
  const { supabase, profile, error: authError } = await requireAuth();
  if (authError || !profile) return { success: false, error: authError };

  // Check if already liked
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', profile.id)
    .single();

  if (existing) {
    // Unlike
    await supabase.from('post_likes').delete().eq('id', existing.id);
    const { error: rpcError } = await supabase.rpc('decrement_post_likes', { p_post_id: postId });
    if (rpcError) {
      // If RPC doesn't exist, update manually
      await supabase
        .from('community_posts')
        .update({ likes: 0 })
        .eq('id', postId);
    }
  } else {
    // Like
    await supabase.from('post_likes').insert({ post_id: postId, user_id: profile.id });
  }

  // Update likes count directly
  const { count } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  await supabase
    .from('community_posts')
    .update({ likes: count || 0 })
    .eq('id', postId);

  revalidatePath('/community');
  return { success: true, liked: !existing };
}

export async function addPostComment(postId: string, content: string) {
  const { supabase, profile, error: authError } = await requireAuth();
  if (authError || !profile) return { success: false, error: authError };

  if (!content.trim() || content.length > 2000) {
    return { success: false, error: 'Comment must be between 1 and 2000 characters' };
  }

  const { error } = await supabase.from('post_comments').insert({
    post_id: postId,
    user_id: profile.id,
    content: content.trim(),
  });

  if (error) {
    console.error('Error adding comment:', error);
    return { success: false, error: 'Failed to add comment' };
  }

  // Update replies count
  const { count } = await supabase
    .from('post_comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  await supabase
    .from('community_posts')
    .update({ replies_count: count || 0 })
    .eq('id', postId);

  revalidatePath('/community');
  return { success: true };
}

export async function getPostComments(postId: string) {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return [];

  const { data } = await supabase
    .from('post_comments')
    .select('*, author:user_id(full_name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  return data || [];
}

export async function getCommunityPosts(channelCategory?: string) {
  const supabase = await (await import('@/lib/supabase/server')).createClient();

  let query = supabase
    .from('community_posts')
    .select('*, author:user_id(full_name, avatar_url)')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  if (channelCategory) {
    query = query.eq('category', channelCategory);
  }

  const { data } = await query;
  return data || [];
}
