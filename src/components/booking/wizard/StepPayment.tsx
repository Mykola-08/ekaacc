'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { CreditCardIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';

interface StepPaymentProps {
  paymentMethod: 'stripe' | 'wallet';
  setPaymentMethod: (v: 'stripe' | 'wallet') => void;
  user: any;
  walletBalance: number | null;
  price: number;
}

export function StepPayment({
  paymentMethod,
  setPaymentMethod,
  user,
  walletBalance,
  price,
}: StepPaymentProps) {
  return (
    <div className="space-y-6">
      <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
        <h3 className="text-foreground mb-6 flex items-center gap-3 text-xl font-semibold">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
            <HugeiconsIcon icon={CreditCardIcon} className="h-5 w-5" />
          </div>
          Payment Method
        </h3>
        <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
          <TabsList className="bg-secondary mb-8 grid h-12 w-full grid-cols-2 rounded-full p-1">
            <TabsTrigger
              value="stripe"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full font-semibold data-[state=active]:shadow-sm"
            >
              Card / Apple Pay
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              disabled={!user}
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground rounded-full font-semibold data-[state=active]:shadow-sm"
            >
              Wallet {walletBalance !== null && `(€${walletBalance})`}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stripe" className="space-y-6">
            <div className="space-y-4">
              <Input
                className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-9 border-transparent"
                placeholder="Card number"
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-9 border-transparent"
                  placeholder="MM/YY"
                />
                <Input
                  className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-9 border-transparent"
                  placeholder="CVC"
                />
                <Input
                  className="bg-secondary focus:bg-background text-foreground placeholder:text-muted-foreground h-9 border-transparent"
                  placeholder="Zip"
                />
              </div>
              <p className="text-muted-foreground mt-4 text-center text-xs">
                Transactions secured by Stripe. No payment taken until confirmation.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="wallet" className="">
            {user ? (
              walletBalance !== null && walletBalance >= price ? (
                <div className="space-y-4 py-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 p-4 text-success">
                    <HugeiconsIcon icon={Tick02Icon} className="h-8 w-8" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-foreground text-lg font-semibold">Sufficient Balance</p>
                    <p className="text-muted-foreground text-sm">
                      €{price} will be deducted from your €{walletBalance} balance.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 p-4 text-warning">
                    <HugeiconsIcon icon={CreditCardIcon} className="h-8 w-8" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-foreground text-lg font-semibold">Insufficient Balance</p>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Your balance is €{walletBalance}. You need €{price}.
                    </p>
                    <Button variant="outline" asChild className="rounded-full border-2 font-semibold">
                      <Link href="/wallet/top-up" target="_blank">
                        Top Up Wallet
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Please sign in to use Wallet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="text-muted-foreground flex items-start space-x-3 px-2 text-sm">
        <HugeiconsIcon
          icon={Tick02Icon}
          className="h-5 w-5 shrink-0 text-success"
          strokeWidth={2.5}
        />
        <p className="font-medium">I agree to the cancellation policy (24h notice required).</p>
      </div>
    </div>
  );
}
