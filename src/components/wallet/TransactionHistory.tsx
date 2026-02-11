import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDownLeft01Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons';

interface Transaction {
  id: string;
  amount_cents: number;
  type: string;
  description: string;
  created_at: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (!transactions.length) {
    return (
      <div className="bg-card/50 text-muted-foreground rounded-lg py-20 text-center">
        <span className="text-lg font-medium">No transactions found.</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="border-border border-b hover:bg-transparent">
            <TableHead className="text-muted-foreground py-6 pl-8 text-xs font-semibold tracking-widest uppercase">
              Date
            </TableHead>
            <TableHead className="text-muted-foreground py-6 text-xs font-semibold tracking-widest uppercase">
              Description
            </TableHead>
            <TableHead className="text-muted-foreground py-6 pr-8 text-right text-xs font-semibold tracking-widest uppercase">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const isPositive = tx.amount_cents > 0;
            return (
              <TableRow
                key={tx.id}
                className="hover:bg-secondary border-border group border-b transition-colors"
              >
                <TableCell className="text-muted-foreground py-6 pl-8 font-medium">
                  {format(new Date(tx.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="py-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}
                    >
                      {isPositive ? (
                        <HugeiconsIcon
                          icon={ArrowDownLeft01Icon}
                          className="h-5 w-5"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <HugeiconsIcon
                          icon={ArrowUpRight01Icon}
                          className="h-5 w-5"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                    <span className="text-foreground font-semibold">{tx.description}</span>
                  </div>
                </TableCell>
                <TableCell
                  className={`py-6 pr-8 text-right text-lg font-semibold tracking-tight ${isPositive ? 'text-success' : 'text-foreground'}`}
                >
                  {isPositive ? '+' : ''}
                  {new Intl.NumberFormat('en-IE', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(tx.amount_cents / 100)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
