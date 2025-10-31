'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, RefreshCw, PlusCircle } from 'lucide-react';

import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';

import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function BillingSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

function NoInvoicesEmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="mt-4 text-lg font-semibold">No Invoices Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">There are no invoices for this client yet.</p>
            <Button onClick={onCreate} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create First Invoice
            </Button>
        </div>
    );
}

export default function TherapistBillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      // Using a demo client ID for now. This should be dynamic in a real app.
      const inv = await fxService.getInvoicesForClient('demo-client');
      setInvoices(inv || []);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load invoices.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const createInvoice = async () => {
    try {
      const res = await fxService.createInvoice('demo-client', 25, 'Test invoice');
      toast({ title: 'Invoice Created', description: `Invoice ID: ${res?.id}` });
      await loadInvoices();
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create a test invoice.',
      });
    }
  };

  return (
    <SettingsShell>
      <SettingsHeader
        title="Client Billing"
        description="Manage invoices and payments for your clients."
      >
        <div className="flex gap-2">
          <Button onClick={loadInvoices} variant="outline" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
          <Button onClick={createInvoice}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Test Invoice
          </Button>
        </div>
      </SettingsHeader>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <BillingSkeleton />
          ) : invoices.length === 0 ? (
            <NoInvoicesEmptyState onCreate={createInvoice} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-xs">{i.id}</TableCell>
                    <TableCell className="font-medium">€{i.amount.toFixed(2)}</TableCell>
                    <TableCell>{i.description}</TableCell>
                    <TableCell>{i.status || 'Paid'}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </SettingsShell>
  );
}
