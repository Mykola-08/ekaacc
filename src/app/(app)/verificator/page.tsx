'use client';

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Label, Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsItem, TabsList, Textarea } from '@/components/keep';
import { useEffect, useState } from 'react';
;
;
;
;
;
;
;
;
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/supabase-auth';
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
import { AnimatedCard } from '@/components/eka/animated-card';
import { format } from 'date-fns';
import type { PaymentRequest, PaymentMethod } from '@/lib/wallet-types';
import type { Timestamp } from 'firebase/firestore';

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
const toDate = (timestamp: string | Timestamp): Date => {
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  // Firestore Timestamp
  return timestamp.toDate();
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
      if (currentUser.role !== 'Admin' && currentUser.role !== 'Therapist') {
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
        currentUser.role as 'Admin' | 'Therapist'
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
        currentUser.role as 'Admin' | 'Therapist',
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
    return <Badge variant="outline" className={color}>{label}</Badge>;
  };

  if (!currentUser || (currentUser.role !== 'Admin' && currentUser.role !== 'Therapist')) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Verificator
          </h1>
          <p className="text-muted-foreground">Verify transactions, donations, and applications</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {currentUser.role}
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <AnimatedCard delay={100} asChild>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentRequests.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={200} asChild>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seeker Applications</CardTitle>
              <HandHeart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">Pending review</p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={300} asChild>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentRequests.length + applications.length}</div>
              <p className="text-xs text-muted-foreground">Requires action</p>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsItem value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Requests ({paymentRequests.length})
          </TabsItem>
          <TabsItem value="applications">
            <HandHeart className="h-4 w-4 mr-2" />
            Donation Seekers ({applications.length})
          </TabsItem>
        </TabsList>

        {/* Payment Requests Tab */}
        <TabsContent value="payments">
          <AnimatedCard delay={400} asChild>
            <Card>
              <CardHeader>
                <CardTitle>Pending Payment Requests</CardTitle>
                <CardDescription>Verify and approve wallet top-up requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading...</div>
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
                            {format(toDate(request.createdAt), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{request.userId}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-green-600">
                            €{request.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {getPaymentMethodBadge(request.method)}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate text-sm text-muted-foreground">
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
                  <div className="text-center py-12 text-muted-foreground">
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
              <CardHeader>
                <CardTitle>Donation Seeker Applications</CardTitle>
                <CardDescription>Review and approve users requesting donation support</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading...</div>
                ) : applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div
                        key={application.id}
                        className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{application.userName}</h4>
                            <p className="text-sm text-muted-foreground">{application.userEmail}</p>
                          </div>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-1">Story:</p>
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
      <Modal open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Review Payment Request</ModalTitle>
            <ModalDescription>Verify the payment details and approve or reject</ModalDescription>
          </ModalHeader>

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
                    <p className="font-medium">Date: {format(toDate(selectedPayment.createdAt), 'MMM dd, yyyy HH:mm')}</p>
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

          <ModalFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectPayment}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprovePayment}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Application Review Dialog */}
      <Modal open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Review Donation Seeker Application</ModalTitle>
            <ModalDescription>Verify the application and approve or reject</ModalDescription>
          </ModalHeader>

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

          <ModalFooter>
            <Button variant="outline" onClick={() => setApplicationDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectApplication}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApproveApplication}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
