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
            const { data: { user } } = await supabase.auth.getUser();
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
            actionLabel={lastEntry ? "View Journal" : "Write First Entry"}
            variant="default"
        >
            <div className="flex-1 flex flex-col justify-center">
                {lastEntry ? (
                    <div className="bg-[hsl(var(--secondary))] p-4 rounded-xl border border-[hsl(var(--border))]">
                        <div className="text-[15px] text-[hsl(var(--muted-foreground))] line-clamp-3 leading-relaxed italic relative">
                            <span className="text-[hsl(var(--muted))] text-4xl leading-none absolute -top-3 -left-2">“</span>
                            {lastEntry.content}
                            <span className="text-[hsl(var(--muted))] text-4xl leading-none absolute -bottom-5 -right-1">”</span>
                        </div>
                        <div className="mt-3 text-[11px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider text-right">
                            {new Date(lastEntry.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 px-2">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <PenLine className="w-6 h-6" />
                        </div>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Reflecting on your day improves mental clarity. Take a moment for yourself.
                        </p>
                    </div>
                )}
            </div>
        </DashboardCard>
    );
}
