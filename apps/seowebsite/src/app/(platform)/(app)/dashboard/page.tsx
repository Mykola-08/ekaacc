import { AuthGuard } from '@/components/platform/auth/auth-guard'
import Dashboard from '@/components/platform/dashboard'
import { getUpcomingSession } from '@/app/actions/booking'
import { getWalletBalanceAction } from '@/app/actions/wallet'

export default async function DashboardPage() {
  const upcomingSession = await getUpcomingSession();
  const walletRes = await getWalletBalanceAction();
  const walletBalance = walletRes.success ? walletRes.balance : undefined;

  return (
    <AuthGuard>
      <div className="container mx-auto p-4 md:p-8">
        <Dashboard upcomingSession={upcomingSession} walletBalance={walletBalance} />
      </div>
    </AuthGuard>
  )
}
