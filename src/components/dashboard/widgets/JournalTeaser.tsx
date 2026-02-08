'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, PenLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardCard } from '../shared/DashboardCard';

export function JournalTeaser() {
  const [lastEntry, setLastEntry] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchLastEntry = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) setLastEntry(data);
    };
    fetchLastEntry();
  }, []);

  return (
    <DashboardCard
      title="My Journal"
      icon={BookOpen}
      onAction={() => router.push('/journal')}
      actionLabel={lastEntry ? 'View Journal' : 'Write First Entry'}
      variant="default"
    >
      <div className="flex flex-1 flex-col justify-center">
        {lastEntry ? (
          <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] p-4">
            <div className="relative line-clamp-3 text-[15px] leading-relaxed text-[hsl(var(--muted-foreground))] italic">
              <span className="absolute -top-3 -left-2 text-4xl leading-none text-[hsl(var(--muted))]">
                “
              </span>
              {lastEntry.content}
              <span className="absolute -right-1 -bottom-5 text-4xl leading-none text-[hsl(var(--muted))]">
                ”
              </span>
            </div>
            <div className="mt-3 text-right text-xs font-bold tracking-wider text-[hsl(var(--muted-foreground))] uppercase">
              {new Date(lastEntry.created_at).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <div className="px-2 py-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <PenLine className="h-6 w-6" />
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Reflecting on your day improves mental clarity. Take a moment for yourself.
            </p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
