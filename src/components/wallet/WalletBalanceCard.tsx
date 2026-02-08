import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';

interface WalletBalanceCardProps {
  balanceCents: number;
  currency?: string;
}

export function WalletBalanceCard({ balanceCents, currency = 'EUR' }: WalletBalanceCardProps) {
  const formatted = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currency,
  }).format(balanceCents / 100);

  return (
    <Card className="bg-background border-border overflow-hidden rounded-[20px] shadow-sm">
      <CardContent className="p-10">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground text-[13px] font-bold tracking-wider uppercase">
            Current Balance
          </span>
          <div className="text-foreground text-6xl font-black tracking-tight">{formatted}</div>
          <p className="text-muted-foreground mt-3 text-[15px] font-medium opacity-80">
            Available for bookings and products
          </p>
        </div>
        <div className="mt-10">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 shadow-primary/20 h-14 w-full rounded-full border-0 px-8 text-base font-bold shadow-xl transition-all active:scale-95 sm:w-auto"
          >
            <Link href="/wallet/top-up">
              <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-5 w-5" strokeWidth={2.75} /> Top
              Up Wallet
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
