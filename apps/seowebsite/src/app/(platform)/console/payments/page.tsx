"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { CreditCard } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          Payments
        </h1>
        <p className="text-muted-foreground">View and manage payment transactions</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Payment management functionality coming soon. View transactions, refunds, and payment history here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
