import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { JournalPageClient } from './journal-client';

export default async function JournalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: entries } = await supabase
    .from('journal_entries')
    .select('id, title, content, mood, mood_score, tags, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30);

  return <JournalPageClient entries={entries ?? []} />;
}
