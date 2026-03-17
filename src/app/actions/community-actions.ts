'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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
