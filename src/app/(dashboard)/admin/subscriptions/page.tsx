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
import { Button } from '@/components/ui/button';

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stripe/subscriptions?limit=20')
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setSubscriptions(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (subId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      const res = await fetch('/api/admin/stripe/subscriptions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId: subId, prorate: true }),
      });
      if (res.ok) {
        setSubscriptions(
          subscriptions.map((s) => (s.id === subId ? { ...s, status: 'canceled' } : s))
        );
      } else {
        const error = await res.json();
        alert(`Failed to cancel: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error cancelling subscription');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage active user subscriptions directly via Stripe.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
          <CardDescription>View, manage, and cancel Stripe subscriptions.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-muted-foreground py-6 text-center">Loading subscriptions...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Interval</TableHead>
                    <TableHead>Current Period End</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No subscriptions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="max-w-50 truncate">
                          {sub.customer?.email || sub.customer}
                        </TableCell>
                        <TableCell>
                          <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{sub.items?.data[0]?.plan?.interval || 'unknown'}</TableCell>
                        <TableCell>
                          {new Date(sub.current_period_end * 1000).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancel(sub.id)}
                            disabled={sub.status === 'canceled'}
                          >
                            {sub.status === 'canceled' ? 'Canceled' : 'Cancel'}
                          </Button>
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
