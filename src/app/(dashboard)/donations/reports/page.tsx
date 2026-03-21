'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  FavouriteIcon,
  InvoiceIcon,
  ArrowUpRight01Icon,
  ArrowTurnDownIcon,
} from '@hugeicons/core-free-icons';

interface Transaction {
  id: string;
  created_at: string;
  type: string;
  amount: number;
  description: string;
  status: string;
}

export default function DonationReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { getClientTransactions } = await import('@/app/actions/wallet');
        const txns = await getClientTransactions().catch(() => []);
        setTransactions(txns);
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (loading) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight">Donation Reports</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your donation and payment history.</p>
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted h-20 animate-pulse rounded-[var(--radius)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-4xl font-semibold tracking-tight">
            Donation Reports
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Your donation and payment history.</p>
        </div>
        <Badge variant="outline" className="w-fit">
          <HugeiconsIcon icon={InvoiceIcon} className="mr-1 size-3" />
          {transactions.length} transactions
        </Badge>
      </div>

      {/* Summary Card */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="border-border rounded-[var(--radius)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <HugeiconsIcon icon={InvoiceIcon} className="text-primary size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{transactions.length}</div>
            <p className="text-muted-foreground text-xs">All-time payment records</p>
          </CardContent>
        </Card>
        <Card className="border-border rounded-[var(--radius)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <HugeiconsIcon icon={FavouriteIcon} className="text-destructive size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(
                totalAmount
              )}
            </div>
            <p className="text-muted-foreground text-xs">Across all transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card className="border-border mt-8 rounded-[var(--radius)]">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All your payments and donations</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="border-border bg-muted/30 rounded-[var(--radius)] border-2 border-dashed py-12 text-center">
              <HugeiconsIcon
                icon={FavouriteIcon}
                className="text-muted-foreground/50 mx-auto mb-4 size-10"
              />
              <h3 className="text-foreground text-lg font-semibold">No transactions yet</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Your donation and payment history will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between rounded-[var(--radius)] border p-4"
                >
                  <div className="flex items-center gap-3">
                    {txn.amount >= 0 ? (
                      <div className="bg-success/10 flex h-9 w-9 items-center justify-center rounded-full">
                        <HugeiconsIcon icon={ArrowUpRight01Icon} className="text-success size-4" />
                      </div>
                    ) : (
                      <div className="bg-destructive/10 flex h-9 w-9 items-center justify-center rounded-full">
                        <HugeiconsIcon
                          icon={ArrowTurnDownIcon}
                          className="text-destructive size-4"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{txn.description || 'Transaction'}</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(txn.created_at).toLocaleDateString('en-IE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${txn.amount >= 0 ? 'text-success' : 'text-destructive'}`}
                    >
                      {txn.amount >= 0 ? '+' : ''}
                      {new Intl.NumberFormat('en-IE', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(txn.amount)}
                    </p>
                    <Badge variant="outline" className="text-2xs">
                      {txn.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
