import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

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
    <Card className="bg-background border-border shadow-sm rounded-[36px] overflow-hidden">
      <CardContent className="p-10">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Current Balance</span>
          <div className="text-6xl font-black tracking-tight text-foreground">{formatted}</div>
          <p className="text-[15px] text-muted-foreground mt-3 font-medium opacity-80">
            Available for bookings and products
          </p>
        </div>
        <div className="mt-10">
          <Button asChild className="w-full sm:w-auto h-14 px-8 rounded-full bg-primary hover:bg-primary/90 font-bold shadow-xl shadow-primary/20 border-0 active:scale-95 transition-all text-base">
            <Link href="/wallet/top-up">
              <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-5 w-5" strokeWidth={2.75} /> Top Up Wallet
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

