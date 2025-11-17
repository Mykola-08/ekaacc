'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/supabase-auth';
import { CreditCard, Check, Clock, Euro } from 'lucide-react';
import type { PaymentRequest } from '@/lib/wallet-types';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import {
    StatCard,
    PaymentsFilter,
    PaymentsTable,
    PaymentsPageSkeleton
} from './components';

export default function AdminPaymentsPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'confirm' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const { getPaymentService } = await import('@/services/payment-service');
      const service = await getPaymentService();
      const allPayments = await service.getPendingPaymentRequests(); // In a real app, you might fetch more than just pending
      setPayments(allPayments);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load payment requests', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const applyFilters = useCallback(() => {
    let filtered = [...payments];
    if (statusFilter !== 'all') filtered = filtered.filter(p => p.status === statusFilter);
    if (methodFilter !== 'all') filtered = filtered.filter(p => p.method === methodFilter);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.userName.toLowerCase().includes(query) ||
        p.userEmail.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    setFilteredPayments(filtered);
  }, [payments, statusFilter, methodFilter, searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handlePaymentAction = async (type: 'confirm' | 'reject') => {
    if (!selectedPayment || !currentUser) return;
    if (type === 'reject' && !rejectionReason) {
        toast({ title: 'Validation Error', description: 'Rejection reason is required.', variant: 'destructive' });
        return;
    }

    try {
        const { getPaymentService } = await import('@/services/payment-service');
        const service = await getPaymentService();

        if (type === 'confirm') {
            await service.confirmPaymentRequest(selectedPayment.id, currentUser.id, currentUser.user_metadata?.name || 'Admin', 'Admin');
            toast({ title: 'Payment Confirmed', description: `€${selectedPayment.amount} credited to ${selectedPayment.userName}` });
        } else {
            await service.rejectPaymentRequest(selectedPayment.id, currentUser.id, currentUser.user_metadata?.name || 'Admin', 'Admin', rejectionReason);
            toast({ title: 'Payment Rejected', description: `Request from ${selectedPayment.userName} rejected` });
        }

        setActionDialogOpen(false);
        setSelectedPayment(null);
        setRejectionReason('');
        await loadPayments();
    } catch (error: any) {
        toast({ title: 'Error', description: error.message || `Failed to ${type} payment`, variant: 'destructive' });
    }
  };

  const openActionDialog = (payment: PaymentRequest, type: 'confirm' | 'reject') => {
    setSelectedPayment(payment);
    setActionType(type);
    setRejectionReason('');
    setActionDialogOpen(true);
  };

  const openProofDialog = (payment: PaymentRequest) => {
    setSelectedPayment(payment);
    setProofDialogOpen(true);
  };

  const stats = {
    pendingCount: payments.filter(p => p.status === 'pending').length,
    confirmedToday: payments.filter(p => p.status === 'confirmed' && p.confirmedAt && new Date(p.confirmedAt as string).toDateString() === new Date().toDateString()).length,
    pendingVolume: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
  };

  if (!currentUser || (currentUser.role !== 'Admin' && currentUser.role !== 'Therapist')) {
    return (
      <SettingsShell>
        <SettingsHeader title="Access Denied" description="You do not have permission to view this page." />
      </SettingsShell>
    );
  }

  return (
    <SettingsShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-primary" />
          <SettingsHeader
            title="Payment Requests"
            description="Review and process user payment requests for Bizum and cash."
          />
        </div>
        <Button onClick={loadPayments} variant="outline" disabled={loading}>Refresh</Button>
      </div>

      {loading ? <PaymentsPageSkeleton /> : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Pending Requests" value={stats.pendingCount.toString()} icon={Clock} description="Awaiting review" />
            <StatCard title="Confirmed Today" value={stats.confirmedToday.toString()} icon={Check} description="Processed successfully" />
            <StatCard title="Pending Volume" value={`€${stats.pendingVolume.toFixed(2)}`} icon={Euro} description="Total amount awaiting confirmation" />
          </div>

          <PaymentsFilter
            statusFilter={statusFilter} onStatusChange={setStatusFilter}
            methodFilter={methodFilter} onMethodChange={setMethodFilter}
            searchQuery={searchQuery} onSearchChange={setSearchQuery}
          />

          <PaymentsTable
            payments={filteredPayments}
            onViewProof={openProofDialog}
            onConfirm={(p) => openActionDialog(p, 'confirm')}
            onReject={(p) => openActionDialog(p, 'reject')}
          />
        </div>
      )}

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === 'confirm' ? 'Confirm Payment' : 'Reject Payment'}</DialogTitle>
            <DialogDescription>
              {actionType === 'confirm' ? `Confirm payment of €${selectedPayment?.amount} from ${selectedPayment?.userName}?` : `Reject payment request from ${selectedPayment?.userName}?`}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="py-4 space-y-4">
              {actionType === 'reject' && (
                <div>
                  <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                  <Textarea id="rejectionReason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="e.g., Proof not clear, amount incorrect..." />
                </div>
              )}
              <p className="text-sm text-muted-foreground">This action will be logged and cannot be undone.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>Cancel</Button>
            {actionType === 'confirm' ? (
              <Button onClick={() => handlePaymentAction('confirm')}>Confirm</Button>
            ) : (
              <Button variant="outline" onClick={() => handlePaymentAction('reject')} disabled={!rejectionReason}>Reject</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Proof Dialog */}
      <Dialog open={proofDialogOpen} onOpenChange={setProofDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
            <DialogDescription>Submitted by {selectedPayment?.userName}</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="py-4 space-y-4">
              {selectedPayment.proofText && (
                <div>
                  <Label>Reference/Notes</Label>
                  <p className="p-3 bg-muted rounded-md text-sm">{selectedPayment.proofText}</p>
                </div>
              )}
              {selectedPayment.proofImageUrl && (
                <div>
                  <Label>Proof Image</Label>
                  <img src={selectedPayment.proofImageUrl} alt="Payment proof" className="mt-2 rounded-md border w-full" />
                </div>
              )}
              {!selectedPayment.proofText && !selectedPayment.proofImageUrl && <p className="text-muted-foreground">No proof was submitted.</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setProofDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsShell>
  );
}
