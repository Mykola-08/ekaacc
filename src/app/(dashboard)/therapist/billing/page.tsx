'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, RefreshCw, PlusCircle, Clock, CheckCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { PageSection } from '@/components/ui/page-section';
import { DollarCircleIcon } from '@hugeicons/core-free-icons';

import fxService from '@/lib/platform/services/platform-service';
import { useToast } from '@/hooks/platform/ui/use-toast';
function BillingSkeleton() {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-[12px] border p-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function NoInvoicesEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={DollarCircleIcon}
      title="No Invoices Found"
      description="There are no invoices for this client yet."
      action={
        <Button onClick={onCreate} variant="default">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create First Invoice
        </Button>
      }
    />
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
      const res = await fxService.createChargeForSession(
        'demo-client',
        'demo-session',
        25,
        'Test invoice'
      );
      toast({ title: 'Charge Created', description: `Charge ID: ${res?.id || 'demo-charge'}` });
      await loadInvoices();
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create a test charge.',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <PageSection
          title="Client Billing"
          description="Manage invoices and payments for your clients."
          level="h2"
          actions={
            <div className="flex gap-2">
              <Button onClick={loadInvoices} variant="outline" loading={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={createInvoice} variant="default">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Test Invoice
              </Button>
            </div>
          }
        />

        {/* Billing Table */}
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
                    <TableHead>
                      <span className="text-sm font-medium">Invoice ID</span>
                    </TableHead>
                    <TableHead>
                      <span className="text-sm font-medium">Amount</span>
                    </TableHead>
                    <TableHead>
                      <span className="text-sm font-medium">Description</span>
                    </TableHead>
                    <TableHead>
                      <span className="text-sm font-medium">Status</span>
                    </TableHead>
                    <TableHead className="text-right">
                      <span className="text-sm font-medium">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>
                        <span className="font-mono text-xs">{i.id}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">€{i.amount.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{i.description}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={i.status === 'Paid' ? 'paid' : 'pending'} label={i.status || 'Paid'} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
