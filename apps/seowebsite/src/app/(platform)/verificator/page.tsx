'use client';

import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Label } from '@/components/platform/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/platform/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/platform/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs';
import { Textarea } from '@/components/platform/ui/textarea';
import { useEffect, useState } from 'react';
;
;
;
;
;
;
;
;
import { useToast } from '@/hooks/platform/use-toast';
import { useAuth } from '@/lib/platform/supabase-auth';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Euro, 
  HandHeart, 
  CreditCard, 
  FileText,
  AlertCircle,
  Eye,
  User,
  Shield
} from 'lucide-react';
import { AnimatedCard } from '@/components/platform/eka/animated-card';
import { format } from 'date-fns';
import type { PaymentRequest, PaymentMethod } from '@/lib/platform/wallet-types';
// Firebase types removed – we only handle string dates here

interface DonationSeekerApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  story: string;
  targetAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Helper to convert Timestamp or string to Date
const toDate = (timestamp: string): Date => {
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  // Firestore Timestamp
  return new Date(timestamp);
};

export default function VerificatorPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Payment requests
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Donation seeker applications
  const [applications, setApplications] = useState<DonationSeekerApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<DonationSeekerApplication | null>(null);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role?.name !== 'Admin' && currentUser.role?.name !== 'Therapist') {
        router.push('/home');
        return;
      }
      loadData();
    } else if (currentUser === null) {
      // If user is explicitly null (not loading), redirect
      router.push('/login');
    }
  }, [currentUser, router]);

  const loadData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const { getPaymentService } = await import('@/services/payment-service');
      const paymentService = await getPaymentService();

      // Load all pending payment requests
      const payments = await paymentService.getPendingPaymentRequests();
      setPaymentRequests(payments);

      // Mock donation seeker applications (would come from database)
      const mockApplications: DonationSeekerApplication[] = [
        {
          id: '1',
          userId: 'user-1',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          story: 'I am undergoing intensive physical therapy after a car accident and need financial support to continue my treatment...',
          targetAmount: 500,
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          userId: 'user-2',
          userName: 'Jane Smith',
          userEmail: 'jane@example.com',
          story: 'Living with chronic pain has made it difficult to afford regular therapy sessions. Any support would be greatly appreciated...',
          targetAmount: 750,
          status: 'pending',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error loading verification data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load verification data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async () => {
    if (!selectedPayment || !currentUser) return;

    try {
      const { getPaymentService } = await import('@/services/payment-service');
      const paymentService = await getPaymentService();

      await paymentService.confirmPaymentRequest(
        selectedPayment.id,
        currentUser.id,
        currentUser.name || 'Unknown',
        currentUser.role?.name as 'Admin' | 'Therapist'
      );

      toast({
        title: 'Payment Approved',
        description: `€${selectedPayment.amount} has been added to the user's wallet.`,
      });

      setPaymentDialogOpen(false);
      setSelectedPayment(null);
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve payment',
        variant: 'destructive',
      });
    }
  };

  const handleRejectPayment = async () => {
    if (!selectedPayment || !rejectionReason || !currentUser) {
      toast({
        title: 'Rejection Reason Required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { getPaymentService } = await import('@/services/payment-service');
      const paymentService = await getPaymentService();

      await paymentService.rejectPaymentRequest(
        selectedPayment.id,
        currentUser.id,
        currentUser.name || 'Unknown',
        currentUser.role?.name as 'Admin' | 'Therapist',
        rejectionReason
      );

      toast({
        title: 'Payment Rejected',
        description: 'The user has been notified.',
      });

      setPaymentDialogOpen(false);
      setSelectedPayment(null);
      setRejectionReason('');
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject payment',
        variant: 'destructive',
      });
    }
  };

  const handleApproveApplication = async () => {
    if (!selectedApplication) return;

    try {
      // In real implementation, this would update the database
      toast({
        title: 'Application Approved',
        description: `${selectedApplication.userName}'s donation seeker application has been approved.`,
      });

      setApplicationDialogOpen(false);
      setSelectedApplication(null);
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve application',
        variant: 'destructive',
      });
    }
  };

  const handleRejectApplication = async () => {
    if (!selectedApplication || !rejectionReason) {
      toast({
        title: 'Rejection Reason Required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    try {
      // In real implementation, this would update the database
      toast({
        title: 'Application Rejected',
        description: `${selectedApplication.userName} has been notified.`,
      });

      setApplicationDialogOpen(false);
      setSelectedApplication(null);
      setRejectionReason('');
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject application',
        variant: 'destructive',
      });
    }
  };

  const getPaymentMethodBadge = (method: PaymentMethod | 'transfer' | 'card') => {
    const config: Record<string, { color: string; label: string }> = {
      cash: { color: 'bg-green-500/10 text-green-600 border-green-500/20', label: 'Cash' },
      bizum: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', label: 'Bizum' },
      transfer: { color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', label: 'Transfer' },
      card: { color: 'bg-orange-500/10 text-orange-600 border-orange-500/20', label: 'Card' },
      wallet: { color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20', label: 'Wallet' },
    };
    const { color, label } = config[method] || config.cash;
    return <Badge color="primary" className={color}>{label}</Badge>;
  };

  if (!currentUser || (currentUser.role?.name !== 'Admin' && currentUser.role?.name !== 'Therapist')) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/home')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Verificator
          </h1>
          <p className="text-muted-foreground">Verify transactions, donations, and applications</p>
        </div>
        <Badge color="primary" className="text-sm">
          {currentUser.role?.name}
        </Badge>
      </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-6">
        <AnimatedCard delay={100} asChild>
          <Card>
            <CardHeader className="flex items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentRequests.length}</div>
              <p className="text-xs">Awaiting verification</p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={200} asChild>
          <Card>
            <CardHeader className="flex items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium">Seeker Applications</CardTitle>
              <HandHeart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs">Pending review</p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={300} asChild>
          <Card>
            <CardHeader className="flex items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentRequests.length + applications.length}</div>
              <p className="text-xs">Requires action</p>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

        {/* Tabs */}
        <Tabs defaultValue="payments" className="space-y-8">
          <TabsList className="grid grid-cols-2 gap-2">
            <TabsTrigger value="payments" className="text-sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Requests ({paymentRequests.length})
          </TabsTrigger>
            <TabsTrigger value="applications" className="text-sm">
            <HandHeart className="h-4 w-4 mr-2" />
            Donation Seekers ({applications.length})
          </TabsTrigger>
        </TabsList>

          {/* Payment Requests Tab */}
        <TabsContent value="payments">
          <AnimatedCard delay={400} asChild>
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="font-semibold text-lg">Pending Payment Requests</CardTitle>
                <CardDescription className="text-muted-foreground">Verify and approve wallet top-up requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">Loading...</div>
                ) : paymentRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Proof</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="text-sm">
                            {format(toDate(request.createdAt as string), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{request.userId}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-green-600">
                            €{request.amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {getPaymentMethodBadge(request.method)}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate text-sm">
                              {request.proofText || 'No proof provided'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPayment(request);
                                setPaymentDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No pending payment requests</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </TabsContent>

          {/* Donation Seeker Applications Tab */}
        <TabsContent value="applications">
          <AnimatedCard delay={400} asChild>
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="font-semibold text-lg">Donation Seeker Applications</CardTitle>
                <CardDescription className="text-muted-foreground">Review and approve users requesting donation support</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">Loading...</div>
                ) : applications.length > 0 ? (
                  <div className="space-y-6">
                    {applications.map((application) => (
                      <div
                        key={application.id}
                        className="rounded-xl border p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-lg">{application.userName}</h4>
                            <p className="text-sm">{application.userEmail}</p>
                          </div>
                          <Badge color="warning">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm mb-2">Story:</p>
                          <p className="text-sm line-clamp-2">{application.story}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Euro className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-600">
                              Target: €{application.targetAmount}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedApplication(application);
                              setApplicationDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No pending applications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </TabsContent>
      </Tabs>

      {/* Payment Review Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Payment Request</DialogTitle>
            <DialogDescription>Verify the payment details and approve or reject</DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">User ID</Label>
                  <p className="font-medium">{selectedPayment.userId}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Amount</Label>
                  <p className="text-2xl font-bold text-green-600">€{selectedPayment.amount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Payment Method</Label>
                <div className="mt-1">{getPaymentMethodBadge(selectedPayment.method)}</div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Proof/Reference</Label>
                <div className="mt-1 p-3 rounded-lg bg-muted">
                  <p className="text-sm">{selectedPayment.proofText || 'No proof provided'}</p>
                </div>
              </div>

              {selectedPayment.proofImageUrl && (
                <div>
                  <Label className="text-sm text-muted-foreground">Proof Image</Label>
                  <img
                    src={selectedPayment.proofImageUrl}
                    alt="Payment proof"
                    className="mt-1 rounded-lg border max-h-64 w-full object-contain"
                  />
                </div>
              )}

              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Date: {format(toDate(selectedPayment.createdAt as string), 'MMM dd, yyyy HH:mm')}</p>
                    <p className="text-muted-foreground mt-1">{selectedPayment.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Rejection Reason (if rejecting)</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Provide a reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button color="error" onClick={handleRejectPayment}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprovePayment}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Review Dialog */}
      <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Donation Seeker Application</DialogTitle>
            <DialogDescription>Verify the application and approve or reject</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Applicant</Label>
                  <p className="font-medium">{selectedApplication.userName}</p>
                  <p className="text-sm text-muted-foreground">{selectedApplication.userEmail}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Target Amount</Label>
                  <p className="text-2xl font-bold text-green-600">€{selectedApplication.targetAmount}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Story</Label>
                <div className="mt-1 p-4 rounded-lg bg-muted max-h-64 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{selectedApplication.story}</p>
                </div>
              </div>

              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Submitted: {format(toDate(selectedApplication.createdAt), 'MMM dd, yyyy')}</p>
                    <p className="text-muted-foreground mt-1">User ID: {selectedApplication.userId}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="app-rejection-reason">Rejection Reason (if rejecting)</Label>
                <Textarea
                  id="app-rejection-reason"
                  placeholder="Provide a reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setApplicationDialogOpen(false)}>
              Cancel
            </Button>
            <Button color="error" onClick={handleRejectApplication}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApproveApplication}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
