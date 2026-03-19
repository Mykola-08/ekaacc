import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CommunityPageClient } from './community-client';

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: posts } = await supabase
    .from('community_posts')
    .select('id, title, content, category, tags, likes_count, reactions, parent_id, is_anonymous, created_at, author:user_id(full_name, avatar_url)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(30);

  return <CommunityPageClient posts={(posts as any) ?? []} />;
}
