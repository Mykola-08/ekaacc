'use client';

import { useState, useEffect } from 'react';
import { WalletContentHeadless as WalletContent } from '@/components/platform/wallet/wallet-content-headless';
import { LoadingSpinner } from '@/components/ui/loading-states';

export function WalletTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [{ getWalletBalanceAction, getClientTransactions }, { getUserPlanUsages }] =
          await Promise.all([import('@/app/actions/wallet'), import('@/app/actions/plans')]);

        const [balanceRes, plans, transactions] = await Promise.all([
          getWalletBalanceAction(),
          getUserPlanUsages().catch(() => []),
          getClientTransactions().catch(() => []),
        ]);

        const balance =
          balanceRes && 'balance' in balanceRes && typeof balanceRes.balance === 'number'
            ? balanceRes.balance
            : 0;

        setData({ balance, plans, transactions });
      } catch (err) {
        console.error('Failed to load wallet data:', err);
        setData({ balance: 0, plans: [], transactions: [] });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading wallet..." />;
  }

  return (
    <WalletContent
      initialBalance={data.balance}
      initialPlans={data.plans}
      initialTransactions={data.transactions}
    />
  );
}
