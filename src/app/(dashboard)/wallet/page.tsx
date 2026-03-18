import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Wallet01Icon,
  ArrowRight01Icon,
  CreditCardIcon,
  Invoice01Icon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons';

export default async function WalletPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch wallet and recent transactions in parallel
  const [{ data: wallet }, { data: transactions }] = await Promise.all([
    supabase
      .from('wallets')
      .select('balance_cents, currency, updated_at')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('transactions')
      .select('id, amount_cents, currency, type, description, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const balance = wallet ? wallet.balance_cents / 100 : 0;
  const currency = wallet?.currency ?? 'EUR';

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* Header */}
      <div className="flex items-start justify-between px-4 lg:px-6">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <HugeiconsIcon icon={Wallet01Icon} className="size-5 text-muted-foreground" />
            Wallet
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your balance and transaction history.
          </p>
        </div>
        <Link href="/finances">
          <Button size="sm" className="gap-2 rounded-full">
            <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
            Add Funds
          </Button>
        </Link>
      </div>

      {/* Balance card */}
      <div className="px-4 lg:px-6">
        <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-card">
          <CardHeader>
            <CardDescription>Available Balance</CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {balance.toFixed(2)}{' '}
              <span className="text-base font-normal text-muted-foreground">{currency}</span>
            </CardTitle>
          </CardHeader>
          <CardFooter className="gap-2">
            <Link href="/finances">
              <Button variant="outline" size="sm" className="gap-1.5 rounded-full text-xs">
                <HugeiconsIcon icon={CreditCardIcon} className="size-3.5" />
                Manage Finances
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Recent transactions */}
      <div className="px-4 lg:px-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent Transactions</CardTitle>
              <Link href="/finances?tab=transactions">
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  View all
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {(transactions ?? []).length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                  <HugeiconsIcon icon={Invoice01Icon} className="size-6 text-muted-foreground/50" />
                </div>
                <div>
                  <p className="text-sm font-medium">No transactions yet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your payment history will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {(transactions ?? []).map((t) => {
                  const amount = t.amount_cents / 100;
                  const isCredit = t.type === 'credit' || t.type === 'deposit' || t.type === 'refund';
                  return (
                    <div key={t.id} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{t.description ?? 'Transaction'}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(t.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="ml-3 flex shrink-0 items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            t.status === 'completed'
                              ? 'border-success/20 bg-success/10 text-success text-xs'
                              : 'text-xs'
                          }
                        >
                          {t.status ?? 'pending'}
                        </Badge>
                        <span className={`text-sm font-semibold tabular-nums ${isCredit ? 'text-success' : 'text-foreground'}`}>
                          {isCredit ? '+' : '-'}
                          {amount.toFixed(2)} {t.currency ?? currency}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
