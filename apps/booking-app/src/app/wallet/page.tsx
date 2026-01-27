import { createClient } from "@/lib/supabase/server";
import { WalletService } from "@/server/wallet/service";
import { WalletBalanceCard } from "@/components/wallet/WalletBalanceCard";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch full profile for layout
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  const walletService = new WalletService();
  const [balance, transactions] = await Promise.all([
    walletService.getBalance(user.id),
    walletService.getTransactions(user.id)
  ]);

  return (
    <DashboardLayout profile={profile}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">

        <DashboardHeader
          title="Wallet"
          subtitle="Manage your balance and view transaction history."
        >
          <Button variant="outline" className="rounded-[18px] border-border/60 hover:bg-secondary h-10 px-4 font-semibold shadow-none border">
            Export History
          </Button>
        </DashboardHeader>

        <WalletBalanceCard balanceCents={balance} />

        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[20px] font-semibold tracking-tight text-foreground">Transaction History</h2>
          </div>

          <div className="bg-card rounded-[32px] border border-border/60 shadow-sm overflow-hidden p-1">
            <TransactionHistory transactions={transactions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
