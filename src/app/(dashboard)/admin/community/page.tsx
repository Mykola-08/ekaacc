import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CommunityModerationClient } from './community-moderation-client';

export default async function AdminCommunityModerationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  const { data: reports } = await supabase
    .from('community_post_reports')
    .select('id, reason, status, details, created_at, post:post_id(id, title, content)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <CommunityModerationClient initialReports={(reports as any) ?? []} />
    </div>
  );
}
