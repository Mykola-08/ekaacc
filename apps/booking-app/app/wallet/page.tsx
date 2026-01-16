import { createClient } from "@/lib/supabase/server";
import { WalletService } from "@/server/wallet/service";
import { WalletBalanceCard } from "@/components/wallet/WalletBalanceCard";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const walletService = new WalletService();
  const [balance, transactions] = await Promise.all([
    walletService.getBalance(user.id),
    walletService.getTransactions(user.id)
  ]);

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your balance and view transaction history.
        </p>
      </div>

      <WalletBalanceCard balanceCents={balance} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">History</h2>
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
}
