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
import { StatusBadge } from '@/components/ui/status-badge';
import React, { useEffect, useState, useCallback } from 'react';

import { EmptyState } from '@/components/ui/empty-state';
import { PageSection } from '@/components/ui/page-section';
import { DollarCircleIcon, Refresh01Icon, PlusSignCircleIcon } from '@hugeicons/core-free-icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import fxService from '@/lib/platform/services/platform-service';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { HugeiconsIcon } from '@hugeicons/react';

type BillingClient = {
  id: string;
  full_name: string | null;
};

function BillingSkeleton() {
  return (
    <Card className="p-4">
      <div className="">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border p-4">
            <div className="flex-1">
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
      description="There are no invoices for this client yet. Create one to get started."
      action={
        <Button onClick={onCreate} variant="default">
          <HugeiconsIcon icon={PlusSignCircleIcon} className="mr-2 size-4" />
          Create First Invoice
        </Button>
      }
    />
  );
}

export default function TherapistBillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<BillingClient[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<any | null>(null);
  const { toast } = useToast();

  const loadClients = useCallback(async () => {
    setClientsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setClients([]);
        return;
      }

      const { data: therapistProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!therapistProfile?.id) {
        setClients([]);
        return;
      }

      const { data: bookingClients } = await supabase
        .from('bookings')
        .select('client_id, client:profiles!bookings_client_id_fkey(id, full_name)')
        .eq('therapist_id', therapistProfile.id)
        .limit(300);

      const uniqueClients = new Map<string, BillingClient>();
      for (const booking of bookingClients ?? []) {
        const client = Array.isArray(booking.client) ? booking.client[0] : booking.client;
        if (client?.id && !uniqueClients.has(client.id)) {
          uniqueClients.set(client.id, {
            id: client.id,
            full_name: client.full_name,
          });
        }
      }

      const resolvedClients = Array.from(uniqueClients.values());
      setClients(resolvedClients);

      if (!selectedClientId && resolvedClients.length > 0) {
        setSelectedClientId(resolvedClients[0].id);
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load your clients.',
      });
    } finally {
      setClientsLoading(false);
    }
  }, [selectedClientId, toast]);

  const loadInvoices = useCallback(async () => {
    if (!selectedClientId) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const inv = await fxService.getInvoicesForClient(selectedClientId);
      setInvoices(inv || []);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load invoices.',
      });
    } finally {
      setLoading(false);
    }
  }, [selectedClientId, toast]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const openCreateDialog = () => {
    if (!selectedClientId) {
      toast({
        variant: 'destructive',
        title: 'Select client',
        description: 'Choose a client before creating an invoice.',
      });
      return;
    }
    setNewAmount('');
    setNewDescription('');
    setCreateDialogOpen(true);
  };

  const createInvoice = async () => {
    const amount = parseFloat(newAmount);
    if (!newAmount || isNaN(amount) || amount <= 0) {
      toast({ variant: 'destructive', title: 'Invalid amount', description: 'Enter a valid amount greater than 0.' });
      return;
    }
    if (!newDescription.trim()) {
      toast({ variant: 'destructive', title: 'Missing description', description: 'Add a description for this invoice.' });
      return;
    }

    setCreating(true);
    try {
      const res = await fxService.createChargeForSession(
        selectedClientId,
        `manual-${Date.now()}`,
        amount,
        newDescription.trim()
      );
      toast({ title: 'Invoice Created', description: `ID: ${res?.id || 'created'}` });
      setCreateDialogOpen(false);
      await loadInvoices();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create invoice.',
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <PageSection
          title="Client Billing"
          description="Manage invoices and payments for your clients."
          level="h2"
          actions={
            <div className="flex gap-2">
              <Button
                onClick={loadInvoices}
                variant="outline"
                size="sm"
                disabled={loading || !selectedClientId}
              >
                <HugeiconsIcon icon={Refresh01Icon} className="mr-2 size-4" />
                Refresh
              </Button>
              <Button
                onClick={openCreateDialog}
                variant="default"
                size="sm"
                disabled={!selectedClientId}
              >
                <HugeiconsIcon icon={PlusSignCircleIcon} className="mr-2 size-4" />
                Create Invoice
              </Button>
            </div>
          }
        />

        <Card className="mx-4 mb-4 lg:mx-6">
          <CardContent className="pt-6">
            <div className="grid gap-2 sm:max-w-sm">
              <p className="text-foreground text-sm font-medium">Client</p>
              <Select
                value={selectedClientId}
                onValueChange={setSelectedClientId}
                disabled={clientsLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={clientsLoading ? 'Loading clients...' : 'Select a client'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.full_name || 'Unnamed client'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!clientsLoading && clients.length === 0 && (
                <p className="text-muted-foreground text-xs">
                  No clients found for this therapist yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Billing Table */}
        <Card className="mx-4 lg:mx-6">
          <CardContent className="p-0">
            {loading ? (
              <BillingSkeleton />
            ) : invoices.length === 0 ? (
              <NoInvoicesEmptyState onCreate={openCreateDialog} />
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
                        <StatusBadge
                          status={i.status === 'Paid' ? 'paid' : 'pending'}
                          label={i.status || 'Paid'}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setViewInvoice(i)}>
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

      {/* Create Invoice Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>
              Enter the amount and a description for this invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="inv-amount">Amount (€)</Label>
              <Input
                id="inv-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 75.00"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="inv-desc">Description</Label>
              <Input
                id="inv-desc"
                placeholder="e.g. Individual therapy session"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={createInvoice} disabled={creating}>
              {creating ? 'Creating…' : 'Create Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={!!viewInvoice} onOpenChange={(open) => { if (!open) setViewInvoice(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {viewInvoice && (
            <div className="space-y-3 py-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono text-xs">{viewInvoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">€{viewInvoice.amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description</span>
                <span>{viewInvoice.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="capitalize">{viewInvoice.status || 'pending'}</span>
              </div>
              {viewInvoice.created_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(viewInvoice.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewInvoice(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
