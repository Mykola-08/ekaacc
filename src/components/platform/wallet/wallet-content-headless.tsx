'use client';

import React, { useState, useEffect, Fragment } from 'react';
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
import { HugeiconsIcon } from '@hugeicons/react';
import { Wallet01Icon, CreditCardIcon, WorkHistoryIcon, Add01Icon, Cancel01Icon, Tick02Icon, Alert01Icon } from '@hugeicons/core-free-icons';

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
    <form onSubmit={handleSubmit} className="">
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
        className="bg-foreground text-background hover:bg-foreground/90 focus:ring-foreground inline-flex w-full items-center justify-center rounded-xl border border-transparent px-6 py-3 text-base font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="border-background mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
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
  const {
    feedback: walletFeedback,
    setError: setWalletError,
    reset: resetWalletFeedback,
  } = useMorphingFeedback();
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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 pb-12 md:px-8">
      {/* Header */}
      <div className="animate-fade-in flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-foreground text-4xl leading-tight font-extrabold tracking-tight">
            Wallet & Plans
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your credits, transactions, and membership plans.
          </p>
          <InlineFeedback
            status={walletFeedback.status}
            message={walletFeedback.message}
            onDismiss={resetWalletFeedback}
            className="mt-2"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Balance & TopUp */}
        <div className="lg:col-span-2">
          {/* Balance Card */}
          <div className="animate-slide-up bg-foreground text-background relative overflow-hidden rounded-lg p-8">
            <div className="from-foreground/80 to-foreground pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br blur-3xl" />

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
                <div className="bg-muted flex rounded-xl p-1">
                  {amounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTopUpAmount(amt)}
                      className={cn(
                        'flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all',
                        topUpAmount === amt
                          ? 'bg-card text-foreground'
                          : 'text-muted-foreground/80 hover:bg-muted/80 hover:text-foreground'
                      )}
                    >
                      €{amt}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleTopUpClick}
                  className="bg-card hover:bg-muted text-foreground mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-colors"
                >
                  <HugeiconsIcon icon={Add01Icon} className="size-5"  />
                  Add Funds
                </button>
              </div>
            </div>
          </div>

          {/* Transactions & Plans Tabs */}
          <TabGroup as="div" className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <TabList className="bg-muted/80 flex w-fit rounded-lg p-1.5">
              <Tab
                className={({ selected }) =>
                  cn(
                    'rounded-xl px-6 py-2.5 text-sm leading-5 font-semibold transition-all outline-none',
                    'focus:ring-ring/5 focus:ring-2',
                    selected
                      ? 'bg-card text-foreground'
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
                    'focus:ring-ring/5 focus:ring-2',
                    selected
                      ? 'bg-card text-foreground'
                      : 'text-muted-foreground hover:text-foreground/90 hover:bg-card/50'
                  )
                }
              >
                My Plans
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel className="bg-card border-border min-h-100 rounded-lg border p-8 focus:outline-none">
                {initialTransactions.length === 0 ? (
                  <div className="text-muted-foreground flex h-full flex-col items-center justify-center py-12 text-center">
                    <div className="bg-muted/30 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <HugeiconsIcon icon={WorkHistoryIcon} className="text-muted-foreground/60 size-8"  />
                    </div>
                    <p className="font-medium">No transactions yet</p>
                    <p className="text-sm">
                      Your history will appear here once you make a transaction.
                    </p>
                  </div>
                ) : (
                  <div className="">
                    {initialTransactions.slice(0, 10).map((tx) => (
                      <div
                        key={tx.id}
                        className="hover:bg-muted/30 group hover:border-border flex items-center justify-between rounded-lg border border-transparent p-4 transition-colors"
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
                              <HugeiconsIcon icon={Add01Icon} className="size-5"  />
                            ) : (
                              <HugeiconsIcon icon={CreditCardIcon} className="size-5"  />
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

              <TabPanel className="bg-card border-border min-h-100 rounded-lg border p-8 focus:outline-none">
                {initialPlans.length === 0 ? (
                  <div className="text-muted-foreground flex h-full flex-col items-center justify-center py-12 text-center">
                    <div className="bg-muted/30 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <HugeiconsIcon icon={Wallet01Icon} className="text-muted-foreground/60 size-8"  />
                    </div>
                    <p className="font-medium">No active plans</p>
                    <p className="text-sm">Purchase a bundle or subscription to see it here.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {initialPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="bg-muted/30 border-border relative overflow-hidden rounded-lg border p-6"
                      >
                        <div className="relative z-10">
                          <h3 className="text-foreground mb-1 text-lg font-semibold">
                            {plan.name || 'Standard Plan'}
                          </h3>
                          <p className="text-muted-foreground mb-4 text-sm">
                            {plan.credits_remaining} / {plan.credits_total} credits remaining
                          </p>
                          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                            <div
                              className="bg-foreground h-full rounded-full"
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
        <div className="animate-slide-up lg:col-span-1" style={{ animationDelay: '200ms' }}>
          <div className="bg-card border-border rounded-lg border p-8">
            <h3 className="text-foreground mb-4 text-xl font-semibold">Payment Methods</h3>
            {pmLoading ? (
              <div className="">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-muted h-16 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : paymentMethods.length > 0 ? (
              <div className="mb-4">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="bg-muted/30 border-border flex items-center gap-3 rounded-lg border p-4"
                  >
                    <div className="text-muted-foreground bg-muted flex h-6 w-10 items-center justify-center rounded text-xs font-semibold uppercase">
                      {pm.brand}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground text-sm font-semibold">•••• {pm.last4}</p>
                      <p className="text-muted-foreground text-xs">
                        Expires {String(pm.exp_month).padStart(2, '0')}/{pm.exp_year}
                      </p>
                    </div>
                    {pm.is_default && (
                      <span className="bg-foreground/10 text-2xs text-foreground rounded-full px-2.5 py-0.5 font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 border-border mb-4 flex flex-col items-center justify-center rounded-lg border py-8 text-center">
                <HugeiconsIcon icon={CreditCardIcon} className="text-muted-foreground/40 mb-2 size-8"  />
                <p className="text-muted-foreground text-sm">No payment methods saved</p>
                <p className="text-muted-foreground/70 text-xs">
                  Add a card by topping up your wallet
                </p>
              </div>
            )}
            <button
              onClick={() => router.push('/finances?tab=billing')}
              className="border-border text-foreground/90 hover:bg-muted/30 w-full rounded-xl border py-3 font-semibold transition-colors"
            >
              Manage Methods
            </button>
          </div>

          <div className="border-primary/10 bg-primary/5 rounded-lg border p-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <HugeiconsIcon icon={Alert01Icon} className="text-primary size-5"  />
              </div>
              <div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">Need Help?</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  If you have questions about your balance or transactions, our support team is here
                  to help.
                </p>
                <a
                  href="mailto:support@eka.care"
                  className="text-primary hover:text-primary/80 text-sm font-semibold underline"
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
            <div className="bg-foreground/25 fixed inset-0 backdrop-blur-sm" />
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
                <DialogPanel className="bg-card w-full max-w-md transform overflow-hidden rounded-lg p-8 text-left align-middle transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-foreground mb-6 flex items-center justify-between text-2xl leading-6 font-semibold"
                  >
                    <span>Secure Top Up</span>
                    <button
                      onClick={closeModal}
                      className="hover:bg-muted rounded-full p-2 transition-colors"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} className="text-muted-foreground size-5"  />
                    </button>
                  </DialogTitle>

                  <div className="mt-2">
                    <p className="text-muted-foreground mb-6 text-sm">
                      You are about to add{' '}
                      <span className="text-foreground text-base font-semibold">
                        €{topUpAmount}
                      </span>{' '}
                      to your wallet.
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
                        <div className="border-border border-t-foreground h-8 w-8 animate-spin rounded-full border-4"></div>
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
