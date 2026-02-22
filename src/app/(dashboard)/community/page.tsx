import { createClient } from '@/lib/supabase/server';
import { CommunityChannelList } from '@/components/community/CommunityChannelList';
import { CommunityFeed } from '@/components/community/CommunityFeed';

export default async function CommunityPage() {
  const supabase = await createClient();

  // Fetch Channels
  const { data: channels } = await supabase.from('chat_channels').select('*').order('created_at');

  // Default to General (or first)
  const activeChannelId = channels?.[0]?.id || 'general';

  // Fetch Posts for active channel (mocking relationship for now if not set up)
  const { data: posts } = await supabase
    .from('community_posts')
    .select('*, author:author_id(full_name, avatar_url)')
    .order('created_at', { ascending: false });

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-64 hidden md:block">
        <CommunityChannelList
          channels={channels || [{id: 'general', name: 'General', type: 'public'}, {id: 'anxiety', name: 'Anxiety Support', type: 'public'}]}
          activeChannelId={activeChannelId}
        />
      </div>
      <CommunityFeed channelId={activeChannelId} posts={posts || []} />
    </div>
  );
}
