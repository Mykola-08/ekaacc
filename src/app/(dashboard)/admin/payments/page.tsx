'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminPaymentsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stripe/invoices?limit=20')
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setInvoices(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments & Invoices</h1>
        <p className="text-muted-foreground mt-2">
          Manage Stripe transactions and refund capabilities natively.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Latest generated invoices from Stripe.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-muted-foreground py-6 text-center">Loading recent invoices...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No invoices found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">
                          {(inv.amount_due / 100).toLocaleString('en-US', {
                            style: 'currency',
                            currency: inv.currency.toUpperCase(),
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={inv.status === 'paid' ? 'default' : 'secondary'}>
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-50 truncate">
                          {inv.customer?.email || inv.customer_email || inv.customer}
                        </TableCell>
                        <TableCell>{new Date(inv.created * 1000).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {inv.hosted_invoice_url && (
                            <a
                              href={inv.hosted_invoice_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline"
                            >
                              View
                            </a>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
