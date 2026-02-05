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
    <Card className="bg-background border-border shadow-sm rounded-[36px] overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">Current Balance</span>
          <div className="text-5xl font-bold tracking-tighter text-foreground">{formatted}</div>
          <p className="text-[15px] text-muted-foreground mt-2 font-medium">
            Available for bookings and products
          </p>
        </div>
        <div className="mt-8">
          <Button asChild className="w-full sm:w-auto h-12 rounded-[16px] bg-primary hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20 border-0 active:scale-95 transition-all">
            <Link href="/wallet/top-up">
              <Plus className="mr-2 h-5 w-5" strokeWidth={2.75} /> Top Up Wallet
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
