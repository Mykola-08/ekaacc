import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ResourcesPageClient } from './resources-client';

export default async function ResourcesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: resources } = await supabase
    .from('resources')
    .select('id, title, description, category, url, video_url, is_published, created_at, tags')
    .or('is_published.eq.true,published_at.not.is.null')
    .order('created_at', { ascending: false })
    .limit(50);

  // Normalize to frontend shape
  const normalised = (resources ?? []).map((r: any) => ({
    ...r,
    type: r.type ?? r.category,
    url: r.url ?? r.video_url ?? null,
  }));

  return <ResourcesPageClient resources={normalised} />;
}
