import { AuthGuard } from '@/components/platform/auth/auth-guard'
import Dashboard from '@/components/platform/dashboard'
import { getUpcomingSession } from '@/app/actions/booking-actions'
import { getWalletBalanceAction } from '@/app/actions/wallet'

export default async function DashboardPage() {
    const upcomingSession = await getUpcomingSession();
    const walletRes = await getWalletBalanceAction();
    const walletBalance = walletRes.success ? walletRes.balance : undefined;

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20">
                <div className="container mx-auto p-4 md:p-8">
                    <Dashboard upcomingSession={upcomingSession} walletBalance={walletBalance} />
                </div>
            </div>
        </AuthGuard>
    )
}
