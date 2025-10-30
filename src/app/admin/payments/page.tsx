'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Check, X, Eye, Clock, Euro, Filter, Search } from 'lucide-react';
import type { PaymentRequest, PaymentStatus, PaymentMethod } from '@/lib/wallet-types';

export default function AdminPaymentsPage() {
  const { appUser: currentUser } = useAuth();
  const { toast } = useToast();
  
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'confirm' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [payments, statusFilter, methodFilter, searchQuery]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const { getPaymentService } = await import('@/services/payment-service');
      const service = await getPaymentService();
      
      // Load all pending + recent confirmed/rejected
      const allPayments = await service.getPendingPaymentRequests();
      
      setPayments(allPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...payments];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (methodFilter !== 'all') {
      filtered = filtered.filter(p => p.method === methodFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.userName.toLowerCase().includes(query) ||
        p.userEmail.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.proofText?.toLowerCase().includes(query)
      );
    }

    setFilteredPayments(filtered);
  };

  const handleConfirm = async () => {
    if (!selectedPayment || !currentUser) return;

    try {
      const { getPaymentService } = await import('@/services/payment-service');
      const service = await getPaymentService();
      
      await service.confirmPaymentRequest(
        selectedPayment.id,
        currentUser.id,
        currentUser.name || 'Admin',
        currentUser.role as 'Admin' | 'Therapist'
      );

      toast({
        title: 'Payment Confirmed',
        description: `€${selectedPayment.amount} will be credited to ${selectedPayment.userName}'s wallet`,
      });

      setActionDialogOpen(false);
      setSelectedPayment(null);
      loadPayments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to confirm payment',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedPayment || !currentUser || !rejectionReason) return;

    try {
      const { getPaymentService } = await import('@/services/payment-service');
      const service = await getPaymentService();
      
      await service.rejectPaymentRequest(
        selectedPayment.id,
        currentUser.id,
        currentUser.name || 'Admin',
        currentUser.role as 'Admin' | 'Therapist',
        rejectionReason
      );

      toast({
        title: 'Payment Rejected',
        description: `Payment request from ${selectedPayment.userName} has been rejected`,
      });

      setActionDialogOpen(false);
      setSelectedPayment(null);
      setRejectionReason('');
      loadPayments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject payment',
        variant: 'destructive',
      });
    }
  };

  const openConfirmDialog = (payment: PaymentRequest) => {
    setSelectedPayment(payment);
    setActionType('confirm');
    setActionDialogOpen(true);
  };

  const openRejectDialog = (payment: PaymentRequest) => {
    setSelectedPayment(payment);
    setActionType('reject');
    setRejectionReason('');
    setActionDialogOpen(true);
  };

  const openProofDialog = (payment: PaymentRequest) => {
    setSelectedPayment(payment);
    setProofDialogOpen(true);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const variants: Record<PaymentStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      rejected: 'destructive',
      cancelled: 'outline',
      expired: 'outline',
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getMethodBadge = (method: PaymentMethod) => {
    const colors: Record<PaymentMethod, string> = {
      bizum: 'bg-blue-500',
      cash: 'bg-green-500',
      wallet: 'bg-purple-500',
    };

    return <Badge className={colors[method]}>{method.toUpperCase()}</Badge>;
  };

  const pendingCount = payments.filter(p => p.status === 'pending').length;

  if (!currentUser || (currentUser.role !== 'Admin' && currentUser.role !== 'Therapist')) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payment Requests</h1>
          <p className="text-muted-foreground">Review and process user payment requests</p>
        </div>
        <Button onClick={loadPayments} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Today</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => 
                p.status === 'confirmed' && 
                p.confirmedAt && 
                new Date(p.confirmedAt as string).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Processed successfully</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Pending amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PaymentStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Payment Method</Label>
              <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as PaymentMethod | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="bizum">Bizum</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Requests ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No payment requests found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.userName}</div>
                        <div className="text-sm text-muted-foreground">{payment.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">€{payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{getMethodBadge(payment.method)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="max-w-xs truncate">{payment.description}</TableCell>
                    <TableCell>{new Date(payment.createdAt as string).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {payment.status === 'pending' && (
                          <>
                            {(payment.proofImageUrl || payment.proofText) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openProofDialog(payment)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => openConfirmDialog(payment)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openRejectDialog(payment)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {payment.status !== 'pending' && payment.confirmedByName && (
                          <span className="text-sm text-muted-foreground">
                            By {payment.confirmedByName}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'confirm' ? 'Confirm Payment' : 'Reject Payment'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'confirm' 
                ? `Confirm payment of €${selectedPayment?.amount} from ${selectedPayment?.userName}?`
                : `Reject payment request from ${selectedPayment?.userName}?`
              }
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">User:</div>
                <div className="font-medium">{selectedPayment.userName}</div>
                
                <div className="text-muted-foreground">Amount:</div>
                <div className="font-medium">€{selectedPayment.amount}</div>
                
                <div className="text-muted-foreground">Method:</div>
                <div className="font-medium">{selectedPayment.method.toUpperCase()}</div>
                
                {selectedPayment.proofText && (
                  <>
                    <div className="text-muted-foreground">Reference:</div>
                    <div className="font-medium">{selectedPayment.proofText}</div>
                  </>
                )}
              </div>

              {actionType === 'reject' && (
                <div>
                  <Label>Rejection Reason *</Label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            {actionType === 'confirm' ? (
              <Button onClick={handleConfirm}>Confirm Payment</Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason}
              >
                Reject Payment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Proof Dialog */}
      <Dialog open={proofDialogOpen} onOpenChange={setProofDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
            <DialogDescription>Review the proof submitted by {selectedPayment?.userName}</DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              {selectedPayment.proofText && (
                <div>
                  <Label>Reference/Notes:</Label>
                  <p className="mt-1 p-2 bg-muted rounded">{selectedPayment.proofText}</p>
                </div>
              )}

              {selectedPayment.proofImageUrl && (
                <div>
                  <Label>Proof Image:</Label>
                  <img
                    src={selectedPayment.proofImageUrl}
                    alt="Payment proof"
                    className="mt-2 max-w-full rounded border"
                  />
                </div>
              )}

              {!selectedPayment.proofText && !selectedPayment.proofImageUrl && (
                <p className="text-muted-foreground">No proof submitted</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setProofDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
