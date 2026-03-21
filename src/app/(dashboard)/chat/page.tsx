import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChatPageClient } from './chat-client';

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Get channels the user is a member of
  const { data: myChannels } = await supabase
    .from('channels')
    .select('id, name, description, type, created_at, channel_members!inner(user_id)')
    .eq('channel_members.user_id', user.id)
    .eq('is_archived', false)
    .order('updated_at', { ascending: false });

  // Get user's profile name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('auth_id', user.id)
    .single();

  const channels = (myChannels ?? []).map(({ channel_members: _cm, ...ch }) => ch);

  return (
    <ChatPageClient
      myChannels={channels as any}
      userId={user.id}
      userFullName={profile?.full_name ?? null}
    />
  );
}
