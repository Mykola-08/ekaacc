'use client';

import React, { useState } from 'react';
import { Wallet, CreditCard, History, Plus } from 'lucide-react';
import { PageContainer } from '@/components/platform/eka/page-container';
import { PageHeader } from '@/components/platform/eka/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { WalletHistory } from '@/components/platform/wallet/WalletHistory';
import { PlanUsageStats } from '@/components/platform/wallet/PlanUsageStats';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createWalletTopUpIntentAction } from '@/app/actions/wallet';
import type { PlanUsage } from '@/app/actions/plans';
import type { Transaction } from '@/app/actions/wallet';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function TopUpForm({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/wallet`,
      },
      redirect: 'if_required' 
    });

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Top-up successful",
        description: `Successfully added €${amount} to your wallet.`,
      });
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4 animate-fade-in"
    >
      <div className="p-4 bg-muted/50 rounded-xl border border-border">
        <PaymentElement />
      </div>
      <Button 
        type="submit" 
        disabled={!stripe || loading} 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 text-base font-medium shadow-lg transition-all"
      >
        {loading ? 'Processing...' : `Pay €${amount}`}
      </Button>
    </form>
  );
}

interface WalletContentProps {
  initialBalance: number;
  initialPlans: PlanUsage[];
  initialTransactions: Transaction[];
}

export function WalletContent({ initialBalance, initialPlans, initialTransactions }: WalletContentProps) {
  const [balance] = useState(initialBalance);
  const [topUpAmount, setTopUpAmount] = useState(50);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTopUpClick = async () => {
    if (topUpAmount < 5) {
      toast({ title: "Minimum amount is €5", variant: "destructive" });
      return;
    }
    
    try {
      const result = await createWalletTopUpIntentAction(topUpAmount);
      if (result?.clientSecret) {
        setClientSecret(result.clientSecret);
      } else {
        toast({ title: "Error initiating top-up", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Could not connect to payment service", variant: "destructive" });
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Wallet & Plans" 
        description="Manage your credits, top-ups, and subscription plans."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 animate-slide-up">
        {/* Balance Card */}
        <Card className="lg:col-span-4 border-0 shadow-lg bg-gradient-to-br from-primary/10 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Current Balance
            </CardTitle>
            <CardDescription>Available credits for booking sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div>
                 <span className="text-4xl font-bold tracking-tight">€{(balance / 100).toFixed(2)}</span>
              </div>
              
              <div className="space-y-4">
                 <h4 className="font-medium text-sm text-muted-foreground">Quick Top-up</h4>
                 <div className="flex gap-2 flex-wrap">
                    {[20, 50, 100, 200].map((amount) => (
                      <Button 
                        key={amount} 
                        variant={topUpAmount === amount ? "default" : "outline"}
                        onClick={() => {
                          setTopUpAmount(amount);
                          setClientSecret(null);
                        }}
                        className="rounded-full"
                      >
                        €{amount}
                      </Button>
                    ))}
                 </div>
                 
                 {!clientSecret ? (
                    <Button onClick={handleTopUpClick} className="w-full md:w-auto rounded-xl shadow-md">
                      <Plus className="w-4 h-4 mr-2" />
                      Add €{topUpAmount} Credits
                    </Button>
                 ) : (
                    <div className="mt-4">
                      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                         <TopUpForm amount={topUpAmount} onSuccess={() => window.location.reload()} />
                      </Elements>
                    </div>
                 )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans Card */}
        <Card className="lg:col-span-3 border-0 shadow-md">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <CreditCard className="w-5 h-5 text-primary" />
               Active Plans
             </CardTitle>
           </CardHeader>
           <CardContent>
             <PlanUsageStats plans={initialPlans} />
           </CardContent>
        </Card>

        {/* History */}
        <Card className="lg:col-span-7 border-0 shadow-md">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <History className="w-5 h-5 text-primary" />
               Transaction History
             </CardTitle>
           </CardHeader>
           <CardContent>
             <WalletHistory transactions={initialTransactions} loading={false} />
           </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
