'use client';

import React, { useState, useEffect, Fragment } from 'react';
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
import { getPaymentMethods, type PaymentMethod } from '@/app/actions/billing';
import { InlineFeedback } from '@/components/ui/inline-feedback';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { useRouter } from 'next/navigation';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Headless Components ---

function TopUpFormHeadless({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { feedback, setLoading: setFbLoading, setSuccess, setError, reset } = useMorphingFeedback();
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
      setError(error.message || 'Payment failed');
    } else {
      setSuccess(`Successfully added €${amount} to your wallet.`);
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InlineFeedback status={feedback.status} message={feedback.message} onDismiss={reset} />
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
        className="inline-flex w-full items-center justify-center rounded-xl border border-transparent bg-foreground px-6 py-3 text-base font-semibold text-background shadow-lg transition-all hover:bg-foreground/90 focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [pmLoading, setPmLoading] = useState(true);
  const { feedback: walletFeedback, setError: setWalletError, reset: resetWalletFeedback } = useMorphingFeedback();
  const router = useRouter();

  // Load real payment methods
  useEffect(() => {
    getPaymentMethods()
      .then((methods) => setPaymentMethods(methods))
      .catch(() => {})
      .finally(() => setPmLoading(false));
  }, []);

  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  // Quick Amount Options
  const amounts = [20, 50, 100, 200];

  const handleTopUpClick = async () => {
    if (topUpAmount < 5) {
      setWalletError('Minimum amount is €5');
      return;
    }
    setIsOpen(true);

    try {
      const result = await createWalletTopUpIntentAction(topUpAmount);
      if (result?.clientSecret) {
        setClientSecret(result.clientSecret);
      } else {
        setWalletError('Error initiating top-up');
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
      setWalletError('Unexpected error');
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
          <InlineFeedback status={walletFeedback.status} message={walletFeedback.message} onDismiss={resetWalletFeedback} className="mt-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Balance & TopUp */}
        <div className="space-y-8 lg:col-span-2">
          {/* Balance Card */}
          <div className="animate-slide-up relative overflow-hidden rounded-3xl bg-foreground p-8 text-background shadow-sm">
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
                          : 'text-muted-foreground/80 hover:bg-muted/80 hover:text-foreground'
                      )}
                    >
                      €{amt}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleTopUpClick}
                  className="bg-card hover:bg-muted mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-foreground shadow-sm transition-colors"
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
            <TabList className="bg-muted/80 flex w-fit space-x-2 rounded-lg p-1.5">
              <Tab
                className={({ selected }) =>
                  cn(
                    'rounded-xl px-6 py-2.5 text-sm leading-5 font-semibold transition-all outline-none',
                    'focus:ring-2 focus:ring-ring/5',
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
                    'focus:ring-2 focus:ring-ring/5',
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
              <TabPanel className="bg-card min-h-100 rounded-3xl border border-border p-8 shadow-sm focus:outline-none">
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
                        className="hover:bg-muted/30 group flex items-center justify-between rounded-lg border border-transparent p-4 transition-colors hover:border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-full',
                              tx.amount > 0
                                ? 'bg-success text-success'
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
                            <p className="text-foreground font-semibold">
                              {tx.description || 'Top Up'}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            'font-mono font-semibold',
                            tx.amount > 0 ? 'text-success' : 'text-foreground'
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

              <TabPanel className="bg-card min-h-100 rounded-lg border border-border p-8 shadow-sm focus:outline-none">
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
                        className="bg-muted/30 relative overflow-hidden rounded-lg border border-border p-6"
                      >
                        <div className="relative z-10">
                          <h3 className="text-foreground mb-1 text-lg font-semibold">
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
          <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
            <h3 className="text-foreground mb-4 text-xl font-semibold">Payment Methods</h3>
            {pmLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : paymentMethods.length > 0 ? (
              <div className="space-y-3 mb-4">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="bg-muted/30 flex items-center gap-3 rounded-lg border border-border p-4"
                  >
                    <div className="text-muted-foreground flex h-6 w-10 items-center justify-center rounded bg-muted text-xs font-semibold uppercase">
                      {pm.brand}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground text-sm font-semibold">•••• {pm.last4}</p>
                      <p className="text-muted-foreground text-xs">
                        Expires {String(pm.exp_month).padStart(2, '0')}/{pm.exp_year}
                      </p>
                    </div>
                    {pm.is_default && (
                      <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-2xs font-semibold text-foreground">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 mb-4 flex flex-col items-center justify-center rounded-lg border border-border py-8 text-center">
                <CreditCard className="mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No payment methods saved</p>
                <p className="text-xs text-muted-foreground/70">Add a card by topping up your wallet</p>
              </div>
            )}
            <button
              onClick={() => router.push('/finances?tab=billing')}
              className="border-border text-foreground/90 hover:bg-muted/30 w-full rounded-xl border py-3 font-semibold transition-colors"
            >
              Manage Methods
            </button>
          </div>

          <div className="rounded-3xl border border-primary/10 bg-primary/5 p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Need Help?</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  If you have questions about your balance or transactions, our support team is here
                  to help.
                </p>
                <a
                  href="mailto:support@eka.care"
                  className="text-sm font-semibold text-primary underline hover:text-primary/80"
                >
                  Contact Support
                </a>
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
                <DialogPanel className="bg-card w-full max-w-md transform overflow-hidden rounded-3xl p-8 text-left align-middle shadow-sm transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-foreground mb-6 flex items-center justify-between text-2xl leading-6 font-semibold"
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
                      <span className="text-foreground text-base font-semibold">€{topUpAmount}</span> to
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
                        <div className="border-border h-8 w-8 animate-spin rounded-full border-4 border-t-foreground"></div>
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
