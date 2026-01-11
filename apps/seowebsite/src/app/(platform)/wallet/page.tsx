'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, Plus, CreditCard, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '@/components/platform/eka/page-container';
import { PageHeader } from '@/components/platform/eka/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Input } from '@/components/platform/ui/input';
import { getWalletBalanceAction, createWalletTopUpIntentAction } from '@/app/actions/wallet';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { iosSpring, glassEffect } from '@/lib/ui-utils';
import { cn } from '@/lib/utils'; // Assuming this exists or imports from local lib

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
        return_url: `${window.location.origin}/wallet/callback`,
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
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={iosSpring}
      onSubmit={handleSubmit} 
      className="space-y-4"
    >
      <div className="p-4 bg-white/50 rounded-xl border border-gray-100">
        <PaymentElement />
      </div>
      <Button 
        type="submit" 
        disabled={!stripe || loading} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-base font-medium shadow-lg hover:shadow-blue-500/20 transition-all"
      >
        {loading ? 'Processing...' : `Pay €${amount}`}
      </Button>
    </motion.form>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: iosSpring }
};

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState(50);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const result = await getWalletBalanceAction();
      if (result && 'balance' in result && typeof result.balance === 'number') {
        setBalance(result.balance);
      }
    } catch (e) {
      console.error(e);
    }
  };

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
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto space-y-8"
      >
        <motion.div variants={item}>
          <PageHeader
            icon={Wallet}
            title="My Wallet"
            description="Manage your balance and top up for future sessions"
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mt-6">
          {/* Balance Card */}
          <motion.div variants={item} className="h-full">
            <div className={cn(glassEffect, "rounded-3xl p-1 h-full")}>
              <Card className="bg-transparent border-0 shadow-none h-full flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-slate-800">Current Balance</CardTitle>
                  <CardDescription className="text-slate-500 text-base">Available credits for sessions and products</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-semibold text-slate-900 tracking-tighter">€{balance.toFixed(2)}</span>
                   </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-full w-fit">
                     <History className="w-4 h-4" /> Transaction history available in billing
                  </div>
                </CardFooter>
              </Card>
            </div>
          </motion.div>

          {/* Top Up Card */}
          <motion.div variants={item}>
            <div className={cn(glassEffect, "rounded-3xl p-1")}>
              <Card className="bg-transparent border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-slate-800">Top Up Wallet</CardTitle>
                  <CardDescription className="text-slate-500 text-base">Add funds to your account securely</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AnimatePresence mode="wait">
                    {!clientSecret ? (
                      <motion.div
                        key="selection"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={iosSpring}
                        className="space-y-6"
                      >
                         <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 ml-1">Select Amount</label>
                            <div className="grid grid-cols-4 gap-3">
                              {[20, 50, 100, 200].map(amt => (
                                <motion.button 
                                  key={amt} 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setTopUpAmount(amt)}
                                  className={cn(
                                    "py-3 rounded-2xl text-sm font-medium transition-all duration-200 border",
                                    topUpAmount === amt 
                                      ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200" 
                                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                                  )}
                                >
                                  €{amt}
                                </motion.button>
                              ))}
                            </div>
                         </div>
                         <div className="space-y-3">
                           <label className="text-sm font-medium text-slate-700 ml-1">Or Custom Amount</label>
                           <Input 
                              type="number" 
                              min="5" 
                              value={topUpAmount} 
                              onChange={(e) => setTopUpAmount(Number(e.target.value))} 
                              className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 text-lg bg-white/50"
                           />
                         </div>
                         <Button 
                           onClick={handleTopUpClick} 
                           className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-base font-medium shadow-lg hover:shadow-blue-500/20 transition-all group"
                         >
                           <Plus className="w-5 h-5 mr-2" /> 
                           Proceed to Payment
                           <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                         </Button>
                      </motion.div>
                    ) : (
                       <motion.div
                          key="payment"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={iosSpring}
                       >
                         <div className="p-4 mb-4 bg-blue-50 rounded-xl flex justify-between items-center text-blue-900 border border-blue-100">
                             <span className="font-medium">Top up amount: €{topUpAmount}</span>
                             <button onClick={() => setClientSecret(null)} className="text-sm text-blue-600 hover:underline">Change</button>
                         </div>
                         <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <TopUpForm amount={topUpAmount} onSuccess={() => {
                              setClientSecret(null);
                              loadBalance();
                            }} />
                         </Elements>
                       </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageContainer>
  );
}
