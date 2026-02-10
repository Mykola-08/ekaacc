'use client';

import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import Link from 'next/link';
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: string;
  description: string | null;
  created_at: string;
}

const TYPE_COLORS: Record<string, string> = {
  deposit: 'text-emerald-600',
  reward: 'text-emerald-600',
  payment: 'text-foreground',
  refund: 'text-primary',
  adjustment: 'text-amber-600',
  transfer: 'text-indigo-600',
};

export function RecentActivity() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Get wallet for this user
      const { data: wallet } = await supabase
        .from('wallets')
        .select('profile_id')
        .eq('user_id', user.id)
        .single();

      if (!wallet) { setLoading(false); return; }

      const { data } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', wallet.profile_id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) setTransactions(data);
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  return (
    <div className="grid grid-cols-1">
      <DashboardCard title="Recent Transactions" icon={Activity}>
        <div className="mt-4 space-y-1">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center text-sm italic text-muted-foreground">
              No transactions yet.
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="-mx-4 flex cursor-pointer items-center justify-between rounded-xl border-b border-border p-4 px-8 transition-colors last:border-0 last:pb-2 hover:bg-secondary"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-sm font-semibold uppercase text-foreground">
                    {tx.type.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-foreground">
                      {tx.description || tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </p>
                    <p className="text-[13px] font-medium text-muted-foreground">
                      {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`block text-[15px] font-semibold ${TYPE_COLORS[tx.type] || 'text-foreground'}`}>
                    {tx.type === 'payment' ? '-' : '+'}{(tx.amount / 100).toFixed(2)} {tx.currency}
                  </span>
                  <span className="text-[12px] font-medium capitalize text-muted-foreground">
                    {tx.type}
                  </span>
                </div>
              </div>
            ))
          )}
          <div className="border-t border-border pt-4 text-center">
            <Link
              href="/finances"
              className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              View All Transactions
            </Link>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
