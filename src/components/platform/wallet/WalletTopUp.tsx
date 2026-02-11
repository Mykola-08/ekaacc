'use client';

import { useState, useEffect } from 'react';
import { getWalletBalanceAction, createWalletTopUpIntentAction } from '@/app/actions/wallet';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/morphing-toaster';
import { StripeWrapper } from '@/components/platform/payment/StripeWrapper';
import { StripePaymentForm } from '@/components/platform/payment/StripePaymentForm';
import { Wallet, TrendingUp } from 'lucide-react';

const TOP_UP_OPTIONS = [
  { amount: 100, bonus: 1, label: 'Starter' },
  { amount: 500, bonus: 5, label: 'Pro' },
  { amount: 1000, bonus: 10, label: 'Elite' },
];

export function WalletTopUp() {
  const [balance, setBalance] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    const result = await getWalletBalanceAction();
    if (result.success && typeof result.balance === 'number') {
      setBalance(result.balance);
    }
  };

  const handleTopUp = async () => {
    setLoading(true);
    const result = await createWalletTopUpIntentAction(selectedAmount);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else if (result.clientSecret) {
      setClientSecret(result.clientSecret);
    }
  };

  const handleSuccess = () => {
    toast.success('Wallet topped up successfully!');
    setClientSecret(null);
    loadBalance();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {balance !== null ? `�${balance.toFixed(2)}` : 'Loading...'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">�0.00</div>
            <p className="text-muted-foreground text-xs">From volume discounts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Up Wallet</CardTitle>
          <CardDescription>Buy credits and get volume discounts</CardDescription>
        </CardHeader>
        <CardContent>
          {!clientSecret ? (
            <div className="space-y-6">
              <RadioGroup
                value={selectedAmount.toString()}
                onValueChange={(v) => setSelectedAmount(parseInt(v))}
                className="grid grid-cols-1 gap-4 md:grid-cols-3"
              >
                {TOP_UP_OPTIONS.map((option) => (
                  <div key={option.amount}>
                    <RadioGroupItem
                      value={option.amount.toString()}
                      id={`opt-${option.amount}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`opt-${option.amount}`}
                      className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4"
                    >
                      <span className="text-xl font-semibold">�{option.amount}</span>
                      <span className="text-muted-foreground text-sm">{option.label}</span>
                      {option.bonus > 0 && (
                        <span className="mt-2 rounded-full bg-success/20 px-2 py-1 text-xs font-medium text-success">
                          +{option.bonus}% Bonus
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button className="w-full" onClick={handleTopUp} disabled={loading}>
                {loading ? 'Processing...' : `Pay �${selectedAmount}`}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button variant="ghost" onClick={() => setClientSecret(null)}>
                ? Back to options
              </Button>
              <StripeWrapper clientSecret={clientSecret}>
                <StripePaymentForm onSuccess={handleSuccess} />
              </StripeWrapper>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
