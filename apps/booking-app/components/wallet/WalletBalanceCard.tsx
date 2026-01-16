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
    <Card className="bg-linear-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-primary">{formatted}</div>
        <p className="text-xs text-muted-foreground mt-1">
          Available for bookings and products
        </p>
        <div className="mt-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/wallet/top-up">
              <Plus className="mr-2 h-4 w-4" /> Top Up Wallet
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
