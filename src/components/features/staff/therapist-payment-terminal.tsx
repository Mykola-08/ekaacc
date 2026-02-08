'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, RefreshCw, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock Interfaces matching the Service Layer
interface Proof {
  id: string;
  created_at: string;
  booking: {
    id: string;
    display_name: string;
    service_id: string;
  };
  amount_cents: number;
  proof_url?: string;
  reference_code?: string;
  status: 'pending' | 'verified' | 'rejected';
}

export function TherapistPaymentTerminal({ staffId }: { staffId?: string }) {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProofs = async () => {
    setIsLoading(true);
    // Simulate Fetch
    // const res = await fetch(`/api/staff/verifications?force=true`);
    // const data = await res.json();
    setTimeout(() => {
      setProofs([
        {
          id: '1',
          created_at: new Date().toISOString(),
          booking: { id: 'bk_123', display_name: 'John Doe', service_id: 'srv_abc' },
          amount_cents: 5000,
          reference_code: 'TRX-999',
          status: 'pending',
        },
      ]);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  const handleVerify = async (proofId: string, action: 'verified' | 'rejected') => {
    try {
      // await verifyProof(proofId, action);
      toast.success(action === 'verified' ? 'Payment Verified' : 'Payment Rejected', {
        description: 'Booking status has been updated.',
      });
      // Optimistic update
      setProofs((prev) => prev.filter((p) => p.id !== proofId));
    } catch (e) {
      toast.error('Error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Payment Verification</h2>
        <Button variant="outline" size="sm" onClick={fetchProofs}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="log_cash">Log Cash Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {proofs.length === 0 && !isLoading ? (
            <div className="text-muted-foreground bg-muted/20 rounded-lg border border-dashed py-12 text-center">
              No pending proofs found.
            </div>
          ) : (
            proofs.map((proof) => (
              <Card key={proof.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{proof.booking.display_name}</span>
                      <Badge variant="outline">
                        {formatCurrency(proof.amount_cents / 100, 'EUR')}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Ref:{' '}
                      <span className="font-mono text-xs">{proof.reference_code || 'N/A'}</span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(proof.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleVerify(proof.id, 'verified')}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Verify
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleVerify(proof.id, 'rejected')}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="log_cash">
          <Card>
            <CardHeader>
              <CardTitle>Log Cash Reception</CardTitle>
              <CardDescription>Instantly verify a cash payment from a client.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/10 flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8">
                <Banknote className="text-muted-foreground h-12 w-12" />
                <p className="text-muted-foreground max-w-sm text-center">
                  Select a booking from your calendar and click "Mark Paid" to access this feature
                  directly from the schedule view.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
