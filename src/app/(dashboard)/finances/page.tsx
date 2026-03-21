import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Wallet01Icon,
  CreditCardIcon,
  Invoice01Icon,
  PlusSignIcon,
  Clock01Icon,
  BankIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@hugeicons/core-free-icons';
import { AddFundsDialog } from './components/AddFundsDialog';
import { PaykitWrapper } from '@/components/paykit-wrapper';

function formatCurrency(cents: number, currency = 'EUR') {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function FinancesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [walletRes, transactionsRes, upcomingBookingsRes] = await Promise.all([
    supabase
      .from('wallets')
      .select('balance_cents, currency')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle(),
    supabase
      .from('wallet_transactions')
      .select('id, amount_cents, type, description, created_at, balance_after_cents')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('bookings')
      .select('id, price_cents, scheduled_at, status')
      .eq('client_id', user.id)
      .eq('status', 'confirmed')
      .gte('scheduled_at', now.toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(5),
  ]);

  const wallet = walletRes.data;
  const transactions = transactionsRes.data ?? [];
  const upcomingBookings = upcomingBookingsRes.data ?? [];
  const currency = wallet?.currency ?? 'EUR';

  const balanceCents = wallet?.balance_cents ?? 0;

  // Monthly spend = sum of negative (purchase) transactions this month
  const monthlySpendCents = transactions
    .filter((t) => t.amount_cents < 0 && t.created_at >= startOfMonth)
    .reduce((sum, t) => sum + Math.abs(t.amount_cents), 0);

  // Upcoming = sum of confirmed future bookings with price
  const upcomingCents = upcomingBookings.reduce((sum, b) => sum + (b.price_cents ?? 0), 0);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <PaykitWrapper>
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Finances & Wallet</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Manage your balance, payment methods, and transaction history.
            </p>
          </div>
          <AddFundsDialog>
            <Button size="sm" className="gap-2">
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              <span>Add Funds</span>
            </Button>
          </AddFundsDialog>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md grid-cols-3" variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* ── Overview ─────────────────────────────────── */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 @xl/main:grid-cols-3">
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Current Balance</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {formatCurrency(balanceCents, currency)}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} />
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="text-muted-foreground text-sm">
                  Available for future bookings
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Monthly Spend</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {formatCurrency(monthlySpendCents, currency)}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <HugeiconsIcon icon={BankIcon} strokeWidth={2} />
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="text-muted-foreground text-sm">This month</CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Upcoming</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {formatCurrency(upcomingCents, currency)}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="text-muted-foreground text-sm">
                  {upcomingBookings.length > 0
                    ? `${upcomingBookings.length} scheduled session${upcomingBookings.length > 1 ? 's' : ''}`
                    : 'No upcoming sessions'}
                </CardFooter>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {recentTransactions.length === 0 ? (
                  <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
                    <HugeiconsIcon icon={Invoice01Icon} className="mb-3 size-10 opacity-20" />
                    <p className="text-sm font-medium">No recent activity</p>
                    <p className="mt-0.5 text-xs">Your transactions will appear here.</p>
                  </div>
                ) : (
                  <ul className="divide-border/50 divide-y">
                    {recentTransactions.map((tx) => (
                      <li key={tx.id} className="flex items-center gap-3 py-3">
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                            tx.amount_cents >= 0
                              ? 'bg-success/10 text-success'
                              : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          <HugeiconsIcon
                            icon={tx.amount_cents >= 0 ? ArrowUpIcon : ArrowDownIcon}
                            className="size-4"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium capitalize">
                            {tx.description ?? tx.type}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatDate(tx.created_at)}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-medium tabular-nums ${
                            tx.amount_cents >= 0 ? 'text-success' : 'text-foreground'
                          }`}
                        >
                          {tx.amount_cents >= 0 ? '+' : ''}
                          {formatCurrency(tx.amount_cents, currency)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Transactions ─────────────────────────────── */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transaction History</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {transactions.length === 0 ? (
                  <div className="text-muted-foreground flex flex-col items-center justify-center py-16 text-center">
                    <HugeiconsIcon icon={Invoice01Icon} className="mb-3 size-10 opacity-20" />
                    <p className="text-sm font-medium">No transactions yet</p>
                    <p className="mt-0.5 text-xs">Add funds to get started.</p>
                  </div>
                ) : (
                  <ul className="divide-border/50 divide-y">
                    {transactions.map((tx) => (
                      <li key={tx.id} className="flex items-center gap-3 py-3">
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                            tx.amount_cents >= 0
                              ? 'bg-success/10 text-success'
                              : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          <HugeiconsIcon
                            icon={tx.amount_cents >= 0 ? ArrowUpIcon : ArrowDownIcon}
                            className="size-4"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium capitalize">
                            {tx.description ?? tx.type}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatDate(tx.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`block text-sm font-medium tabular-nums ${
                              tx.amount_cents >= 0 ? 'text-success' : 'text-foreground'
                            }`}
                          >
                            {tx.amount_cents >= 0 ? '+' : ''}
                            {formatCurrency(tx.amount_cents, currency)}
                          </span>
                          <span className="text-muted-foreground block text-xs">
                            Balance: {formatCurrency(tx.balance_after_cents, currency)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Billing ──────────────────────────────────── */}
          <TabsContent value="billing">
            <Card>
              <CardContent className="text-muted-foreground flex flex-col items-center justify-center py-16 text-center">
                <HugeiconsIcon icon={CreditCardIcon} className="mb-3 size-10 opacity-20" />
                <p className="text-sm font-medium">Pay as you go</p>
                <p className="mt-0.5 max-w-xs text-xs">
                  EKA Balance uses a wallet system. Add funds to your wallet and use them for
                  sessions.
                </p>
                <AddFundsDialog>
                  <Button variant="outline" className="mt-6 gap-2">
                    <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                    Add Funds
                  </Button>
                </AddFundsDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PaykitWrapper>
  );
}
