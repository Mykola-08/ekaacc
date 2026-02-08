'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const TOP_UP_OPTIONS = [
  { amount: 5000, price: 5000, label: '€50 Credit', bonus: null },
  { amount: 10500, price: 10000, label: '€105 Credit', bonus: '€5 Bonus' },
  { amount: 22000, price: 20000, label: '€220 Credit', bonus: '€20 Bonus' },
];

export default function TopUpPage() {
  const handlePurchase = (option: (typeof TOP_UP_OPTIONS)[0]) => {
    // Stub for Stripe Checkout integration
    toast.info(`Redirecting to payment for ${option.label}...`);
    // Simulating redirect
    setTimeout(() => {
      toast.error('Stripe integration not configured in this demo.');
    }, 1000);
  };

  return (
    <div className="container max-w-3xl space-y-6 py-8">
      <Link
        href="/wallet"
        className="text-muted-foreground hover:text-foreground flex items-center text-sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wallet
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Top Up Wallet</h1>
        <p className="text-muted-foreground">Purchase credits to use for quick and easy booking.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TOP_UP_OPTIONS.map((option) => (
          <Card
            key={option.amount}
            className="hover:border-primary/50 flex flex-col transition-colors"
          >
            <CardHeader>
              <CardTitle>{option.label}</CardTitle>
              <CardDescription>
                Pay{' '}
                {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(
                  option.price / 100
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {option.bonus && (
                <span className="focus:ring-ring inline-flex items-center rounded-full border border-transparent bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none dark:bg-green-900 dark:text-green-300">
                  {option.bonus}
                </span>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handlePurchase(option)}>
                <CreditCard className="mr-2 h-4 w-4" /> Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <p className="text-muted-foreground pt-8 text-center text-xs">
        Payments processed securely via Stripe. Credits do not expire.
      </p>
    </div>
  );
}
