// Server Component
export const dynamic = 'force-dynamic';

import { getWalletBalanceAction, getClientTransactions, type Transaction } from '@/app/actions/wallet';
import { getUserPlanUsages, type PlanUsage } from '@/app/actions/plans';
import { WalletContentHeadless as WalletContent } from '@/components/platform/wallet/wallet-content-headless';
import { AuthGuard } from '@/components/platform/auth/auth-guard';

export default async function WalletPage() {
 // Fetch data in parallel for speed ("snappy")
 const [balanceRes, plansData, transactionsData] = await Promise.all([
  getWalletBalanceAction(),
  getUserPlanUsages().catch(() => [] as PlanUsage[]),
  getClientTransactions().catch(() => [] as Transaction[])
 ]);

 const balance = (balanceRes && 'balance' in balanceRes && typeof balanceRes.balance === 'number') 
  ? balanceRes.balance 
  : 0;

 return (
  <AuthGuard>
   <WalletContent 
    initialBalance={balance} 
    initialPlans={plansData as PlanUsage[]} 
    initialTransactions={transactionsData as Transaction[]} 
   />
  </AuthGuard>
 );
}
