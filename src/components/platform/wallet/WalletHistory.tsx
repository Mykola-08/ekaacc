'use client';

import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/platform/ui/table';
import { Badge } from '@/components/platform/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/platform/ui/card';
import { format } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight, Clock, CreditCard } from 'lucide-react';
import { Transaction } from '@/app/actions/wallet'; // Ensure this type is exported

interface WalletHistoryProps {
  transactions: Transaction[];
  loading?: boolean;
}

export function WalletHistory({ transactions, loading }: WalletHistoryProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
        <CardContent className="h-32 flex items-center justify-center text-muted-foreground">
          Loading history...
        </CardContent>
      </Card>
    );
  }

  const getTypeIcon = (type: string, amount: number) => {
    if (type === 'plan_credit') return <Clock className="h-4 w-4 text-blue-500" />;
    return amount > 0 
      ? <ArrowDownLeft className="h-4 w-4 text-green-500" />
      : <ArrowUpRight className="h-4 w-4 text-red-500" />;
  };

  const formatAmount = (type: string, amount: number) => {
    if (type === 'plan_credit') {
      return `${amount > 0 ? '+' : ''}${amount} Credits`;
    }
    return `€${amount.toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No transactions found</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         {getTypeIcon(tx.type, tx.amount)}
                         <span className="capitalize text-xs">{tx.type.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(tx.created_at), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {formatAmount(tx.type, tx.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

