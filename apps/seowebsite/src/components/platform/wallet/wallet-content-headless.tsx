'use client';

import React, { useState, Fragment } from 'react';
import { Wallet, CreditCard, History, Plus, X, Check, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { createWalletTopUpIntentAction } from '@/app/actions/wallet';
import type { PlanUsage } from '@/app/actions/plans';
import type { Transaction } from '@/app/actions/wallet';
import { useToast } from '@/hooks/platform/ui/use-toast';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Headless Components ---

function TopUpFormHeadless({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-xl border border-border">
        <PaymentElement options={{ 
            layout: 'tabs',
        }} />
      </div>
      <button 
        type="submit" 
        disabled={!stripe || loading} 
        className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {loading ? (
            <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
            </>
        ) : `Pay €${amount}`}
      </button>
    </form>
  );
}

interface WalletContentProps {
  initialBalance: number;
  initialPlans: PlanUsage[];
  initialTransactions: Transaction[];
}

export function WalletContentHeadless({ initialBalance, initialPlans, initialTransactions }: WalletContentProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [topUpAmount, setTopUpAmount] = useState(50);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  // Quick Amount Options
  const amounts = [20, 50, 100, 200];

  const handleTopUpClick = async () => {
    if (topUpAmount < 5) {
      toast({ title: "Minimum amount is €5", variant: "destructive" });
      return;
    }
    setIsOpen(true);
    
    try {
      const result = await createWalletTopUpIntentAction(topUpAmount);
      if (result?.clientSecret) {
        setClientSecret(result.clientSecret);
      } else {
        toast({ title: "Error initiating top-up", variant: "destructive" });
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Unexpected error", variant: "destructive" });
      setIsOpen(false);
    }
  };

  const handleSuccess = () => {
      setIsOpen(false);
      setClientSecret(null);
      // Ideally refresh data or optimistically update
      setBalance(prev => prev + topUpAmount * 100); 
  };

  const closeModal = () => {
      setIsOpen(false);
      setClientSecret(null);
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                    Wallet & Plans
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                    Manage your credits, transactions, and membership plans.
                </p>
            </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column: Balance & TopUp */}
            <div className="space-y-8 lg:col-span-2">
                {/* Balance Card */}
                <div className="relative overflow-hidden rounded-4xl bg-gray-900 p-8 text-white shadow-xl animate-slide-up">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-gray-800 to-black rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <p className="text-muted-foreground/80 font-medium mb-1">Total Balance</p>
                            <h2 className="text-5xl font-extrabold tracking-tight">
                                {(balance / 100).toFixed(2)} <span className="text-2xl font-normal text-muted-foreground/80">€</span>
                            </h2>
                        </div>
                         <div className="flex flex-col gap-3 w-full md:w-auto">
                            <label className="text-sm font-medium text-muted-foreground/80">Quick Top-up Amount</label>
                            <div className="flex bg-gray-800/50 p-1 rounded-xl">
                                {amounts.map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setTopUpAmount(amt)}
                                        className={cn(
                                            "flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                                            topUpAmount === amt 
                                                ? "bg-card text-foreground shadow-md" 
                                                : "text-muted-foreground/80 hover:text-white hover:bg-gray-700"
                                        )}
                                    >
                                        €{amt}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={handleTopUpClick}
                                className="w-full py-3 bg-card text-black font-bold rounded-xl hover:bg-muted transition-colors shadow-lg flex items-center justify-center gap-2 mt-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add Funds
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transactions & Plans Tabs */}
                 <TabGroup as="div" className="space-y-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <TabList className="flex space-x-2 rounded-2xl bg-muted/80 p-1.5 w-fit">
                        <Tab className={({ selected }) =>
                            cn(
                            'px-6 py-2.5 rounded-xl text-sm font-semibold leading-5 transition-all outline-none',
                            'focus:ring-2 focus:ring-black/5',
                            selected
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground/90 hover:bg-card/50'
                            )
                        }>
                            Transactions
                        </Tab>
                        <Tab className={({ selected }) =>
                            cn(
                            'px-6 py-2.5 rounded-xl text-sm font-semibold leading-5 transition-all outline-none',
                            'focus:ring-2 focus:ring-black/5',
                            selected
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground/90 hover:bg-card/50'
                            )
                        }>
                            My Plans
                        </Tab>
                    </TabList>
                    
                    <TabPanels>
                         <TabPanel className="bg-card rounded-4xl border border-gray-100 shadow-sm p-8 focus:outline-none min-h-100">
                            {initialTransactions.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-12">
                                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                                        <History className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="font-medium">No transactions yet</p>
                                    <p className="text-sm">Your history will appear here once you make a transaction.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {initialTransactions.slice(0, 10).map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-gray-100 group">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center",
                                                    tx.amount > 0 ? "bg-green-50 text-green-600" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {tx.amount > 0 ? <Plus className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{tx.description || 'Top Up'}</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "font-bold font-mono",
                                                tx.amount > 0 ? "text-green-600" : "text-foreground"
                                            )}>
                                                {tx.amount > 0 ? '+' : ''}{(tx.amount / 100).toFixed(2)} €
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabPanel>
                        
                        <TabPanel className="bg-card rounded-[32px] border border-gray-100 shadow-sm p-8 focus:outline-none min-h-[400px]">
                             {initialPlans.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-12">
                                     <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                                        <Wallet className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="font-medium">No active plans</p>
                                    <p className="text-sm">Purchase a bundle or subscription to see it here.</p>
                                </div>
                             ) : (
                                 <div className="grid gap-4 md:grid-cols-2">
                                     {initialPlans.map((plan) => (
                                         <div key={plan.id} className="p-6 rounded-3xl bg-muted/30 border border-gray-100 relative overflow-hidden">
                                              <div className="relative z-10">
                                                 <h3 className="font-bold text-lg text-foreground mb-1">{plan.name || 'Standard Plan'}</h3>
                                                 <p className="text-sm text-muted-foreground mb-4">{plan.credits_remaining} / {plan.credits_total} credits remaining</p>
                                                 <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                     <div 
                                                        className="h-full bg-black rounded-full" 
                                                        style={{ width: `${(plan.credits_remaining / plan.credits_total) * 100}%` }} 
                                                     />
                                                 </div>
                                              </div>
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </TabPanel>
                    </TabPanels>
                 </TabGroup>
            </div>

            {/* Right Column: Info / Help */}
             <div className="space-y-6 lg:col-span-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="rounded-4xl border border-gray-100 bg-card p-8 shadow-sm">
                    <h3 className="font-bold text-xl text-foreground mb-4">Payment Methods</h3>
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-gray-100 mb-4">
                        <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-muted-foreground">VISA</div>
                        <div>
                             <p className="text-sm font-bold text-foreground">•••• 4242</p>
                             <p className="text-xs text-muted-foreground">Expires 12/28</p>
                        </div>
                    </div>
                     <button className="w-full py-3 border border-border text-foreground/90 font-semibold rounded-xl hover:bg-muted/30 transition-colors">
                        Manage Methods
                    </button>
                </div>

                 <div className="rounded-4xl border border-blue-100 bg-blue-50/50 p-8 shadow-sm">
                    <div className="flex items-start gap-4">
                         <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                             <h3 className="font-bold text-lg text-blue-900 mb-2">Need Help?</h3>
                             <p className="text-sm text-blue-800/80 leading-relaxed mb-4">
                                 If you have questions about your balance or transactions, our support team is here to help.
                             </p>
                             <button className="text-sm font-bold text-blue-700 hover:text-blue-800 underline">
                                 Contact Support
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Top Up Modal */}
        <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-4xl bg-card p-8 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-bold leading-6 text-foreground flex justify-between items-center mb-6"
                  >
                    <span>Secure Top Up</span>
                    <button onClick={closeModal} className="p-2 rounded-full hover:bg-muted transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </DialogTitle>
                  
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-6">
                        You are about to add <span className="font-bold text-foreground text-base">€{topUpAmount}</span> to your wallet.
                    </p>

                    {clientSecret ? (
                         <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                            <TopUpFormHeadless amount={topUpAmount} onSuccess={handleSuccess} />
                        </Elements>
                    ) : (
                        <div className="flex justify-center py-12">
                             <div className="animate-spin rounded-full h-8 w-8 border-4 border-border border-t-black"></div>
                        </div>
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
