'use client';

import React, { useState, Fragment } from 'react';
import { Wallet, CreditCard, History, Plus, X, Check, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';
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

function TopUpFormHeadless({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
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
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: 'Payment failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Top-up successful',
        description: `Successfully added €${amount} to your wallet.`,
      });
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/30 border-border rounded-xl border p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="inline-flex w-full items-center justify-center rounded-xl border border-transparent bg-foreground px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-foreground/90 focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Processing...
          </>
        ) : (
          `Pay €${amount}`
        )}
      </button>
    </form>
  );
}

interface WalletContentProps {
  initialBalance: number;
  initialPlans: PlanUsage[];
  initialTransactions: Transaction[];
}

export function WalletContentHeadless({
  initialBalance,
  initialPlans,
  initialTransactions,
}: WalletContentProps) {
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
      toast({ title: 'Minimum amount is €5', variant: 'destructive' });
      return;
    }
    setIsOpen(true);

    try {
      const result = await createWalletTopUpIntentAction(topUpAmount);
      if (result?.clientSecret) {
        setClientSecret(result.clientSecret);
      } else {
        toast({ title: 'Error initiating top-up', variant: 'destructive' });
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Unexpected error', variant: 'destructive' });
      setIsOpen(false);
    }
  };

  const handleSuccess = () => {
    setIsOpen(false);
    setClientSecret(null);
    // Ideally refresh data or optimistically update
    setBalance((prev) => prev + topUpAmount * 100);
  };

  const closeModal = () => {
    setIsOpen(false);
    setClientSecret(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 pb-12 md:px-8">
      {/* Header */}
      <div className="animate-fade-in flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-foreground text-4xl leading-tight font-extrabold tracking-tight">
            Wallet & Plans
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your credits, transactions, and membership plans.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Balance & TopUp */}
        <div className="space-y-8 lg:col-span-2">
          {/* Balance Card */}
          <div className="animate-slide-up relative overflow-hidden rounded-[24px] bg-foreground p-8 text-white shadow-xl">
            <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-foreground/80 to-foreground blur-3xl" />

            <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-muted-foreground/80 mb-1 font-medium">Total Balance</p>
                <h2 className="text-5xl font-extrabold tracking-tight">
                  {(balance / 100).toFixed(2)}{' '}
                  <span className="text-muted-foreground/80 text-2xl font-normal">€</span>
                </h2>
              </div>
              <div className="flex w-full flex-col gap-3 md:w-auto">
                <label className="text-muted-foreground/80 text-sm font-medium">
                  Quick Top-up Amount
                </label>
                <div className="flex rounded-xl bg-muted p-1">
                  {amounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTopUpAmount(amt)}
                      className={cn(
                        'flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all',
                        topUpAmount === amt
                          ? 'bg-card text-foreground shadow-md'
                          : 'text-muted-foreground/80 hover:bg-muted/80 hover:text-white'
                      )}
                    >
                      €{amt}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleTopUpClick}
                  className="bg-card hover:bg-muted mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-black shadow-lg transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add Funds
                </button>
              </div>
            </div>
          </div>

          {/* Transactions & Plans Tabs */}
          <TabGroup
            as="div"
            className="animate-slide-up space-y-6"
            style={{ animationDelay: '100ms' }}
          >
            <TabList className="bg-muted/80 flex w-fit space-x-2 rounded-[20px] p-1.5">
              <Tab
                className={({ selected }) =>
                  cn(
                    'rounded-xl px-6 py-2.5 text-sm leading-5 font-semibold transition-all outline-none',
                    'focus:ring-2 focus:ring-black/5',
                    selected
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground/90 hover:bg-card/50'
                  )
                }
              >
                Transactions
              </Tab>
              <Tab
                className={({ selected }) =>
                  cn(
                    'rounded-xl px-6 py-2.5 text-sm leading-5 font-semibold transition-all outline-none',
                    'focus:ring-2 focus:ring-black/5',
                    selected
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground/90 hover:bg-card/50'
                  )
                }
              >
                My Plans
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel className="bg-card min-h-100 rounded-[24px] border border-border p-8 shadow-sm focus:outline-none">
                {initialTransactions.length === 0 ? (
                  <div className="text-muted-foreground flex h-full flex-col items-center justify-center py-12 text-center">
                    <div className="bg-muted/30 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <History className="h-8 w-8 text-muted-foreground/60" />
                    </div>
                    <p className="font-medium">No transactions yet</p>
                    <p className="text-sm">
                      Your history will appear here once you make a transaction.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {initialTransactions.slice(0, 10).map((tx) => (
                      <div
                        key={tx.id}
                        className="hover:bg-muted/30 group flex items-center justify-between rounded-[20px] border border-transparent p-4 transition-colors hover:border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-full',
                              tx.amount > 0
                                ? 'bg-green-50 text-green-600'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {tx.amount > 0 ? (
                              <Plus className="h-5 w-5" />
                            ) : (
                              <CreditCard className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="text-foreground font-bold">
                              {tx.description || 'Top Up'}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            'font-mono font-bold',
                            tx.amount > 0 ? 'text-green-600' : 'text-foreground'
                          )}
                        >
                          {tx.amount > 0 ? '+' : ''}
                          {(tx.amount / 100).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </TabPanel>

              <TabPanel className="bg-card min-h-[400px] rounded-[20px] border border-border p-8 shadow-sm focus:outline-none">
                {initialPlans.length === 0 ? (
                  <div className="text-muted-foreground flex h-full flex-col items-center justify-center py-12 text-center">
                    <div className="bg-muted/30 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <Wallet className="h-8 w-8 text-muted-foreground/60" />
                    </div>
                    <p className="font-medium">No active plans</p>
                    <p className="text-sm">Purchase a bundle or subscription to see it here.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {initialPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="bg-muted/30 relative overflow-hidden rounded-[20px] border border-border p-6"
                      >
                        <div className="relative z-10">
                          <h3 className="text-foreground mb-1 text-lg font-bold">
                            {plan.name || 'Standard Plan'}
                          </h3>
                          <p className="text-muted-foreground mb-4 text-sm">
                            {plan.credits_remaining} / {plan.credits_total} credits remaining
                          </p>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-foreground"
                              style={{
                                width: `${(plan.credits_remaining / plan.credits_total) * 100}%`,
                              }}
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
        <div
          className="animate-slide-up space-y-6 lg:col-span-1"
          style={{ animationDelay: '200ms' }}
        >
          <div className="bg-card rounded-[24px] border border-border p-8 shadow-sm">
            <h3 className="text-foreground mb-4 text-xl font-bold">Payment Methods</h3>
            <div className="bg-muted/30 mb-4 flex items-center gap-3 rounded-[20px] border border-border p-4">
              <div className="text-muted-foreground flex h-6 w-10 items-center justify-center rounded bg-muted text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="text-foreground text-sm font-bold">•••• 4242</p>
                <p className="text-muted-foreground text-xs">Expires 12/28</p>
              </div>
            </div>
            <button className="border-border text-foreground/90 hover:bg-muted/30 w-full rounded-xl border py-3 font-semibold transition-colors">
              Manage Methods
            </button>
          </div>

          <div className="rounded-[24px] border border-blue-100 bg-blue-50/50 p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-blue-900">Need Help?</h3>
                <p className="mb-4 text-sm leading-relaxed text-blue-800/80">
                  If you have questions about your balance or transactions, our support team is here
                  to help.
                </p>
                <button className="text-sm font-bold text-blue-700 underline hover:text-blue-800">
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
            <div className="fixed inset-0 bg-foreground/25 backdrop-blur-sm" />
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
                <DialogPanel className="bg-card w-full max-w-md transform overflow-hidden rounded-[24px] p-8 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-foreground mb-6 flex items-center justify-between text-2xl leading-6 font-bold"
                  >
                    <span>Secure Top Up</span>
                    <button
                      onClick={closeModal}
                      className="hover:bg-muted rounded-full p-2 transition-colors"
                    >
                      <X className="text-muted-foreground h-5 w-5" />
                    </button>
                  </DialogTitle>

                  <div className="mt-2">
                    <p className="text-muted-foreground mb-6 text-sm">
                      You are about to add{' '}
                      <span className="text-foreground text-base font-bold">€{topUpAmount}</span> to
                      your wallet.
                    </p>

                    {clientSecret ? (
                      <Elements
                        stripe={stripePromise}
                        options={{ clientSecret, appearance: { theme: 'stripe' } }}
                      >
                        <TopUpFormHeadless amount={topUpAmount} onSuccess={handleSuccess} />
                      </Elements>
                    ) : (
                      <div className="flex justify-center py-12">
                        <div className="border-border h-8 w-8 animate-spin rounded-full border-4 border-t-black"></div>
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
