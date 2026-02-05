import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface WalletBalanceCardProps {
  balanceCents: number;
  currency?: string;
}

export function WalletBalanceCard({ balanceCents, currency = "EUR" }: WalletBalanceCardProps) {
  const formatted = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currency,
  }).format(balanceCents / 100);

  return (
    <Card className="bg-[#FEFFFE] border-[#F5F5F5] shadow-sm rounded-[36px] overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold text-[#999999] uppercase tracking-wide">Current Balance</span>
          <div className="text-5xl font-bold tracking-tighter text-[#222222]">{formatted}</div>
          <p className="text-[15px] text-[#999999] mt-2 font-medium">
            Available for bookings and products
          </p>
        </div>
        <div className="mt-8">
          <Button asChild className="w-full sm:w-auto h-12 rounded-[16px] bg-[#4DAFFF] hover:bg-[#4DAFFF]/90 text-white font-semibold shadow-lg shadow-[#4DAFFF]/20 border-0 active:scale-95 transition-all">
            <Link href="/wallet/top-up">
              <Plus className="mr-2 h-5 w-5" strokeWidth={2.75} /> Top Up Wallet
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
