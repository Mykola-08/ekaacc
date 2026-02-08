'use client';

import { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wallet, Plus, CreditCard, History } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { WALLET_PRODUCTS } from '@/lib/stripe-products';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  timestamp: string;
}

// Dummy hook - replace with actual API integration
const useWallet = () => {
  // Mock data
  return {
    balance: 0,
    currency: 'EUR',
    isLoading: false,
    transactions: [] as WalletTransaction[],
  };
};

export function WalletCard() {
  const { balance, currency } = useWallet();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTopUp = useCallback(async (priceId: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call to create Checkout Session
      // const res = await fetch('/api/checkout/wallet', { method: 'POST', body: JSON.stringify({ priceId }) });
      // const { url } = await res.json();
      // window.location.href = url;

      toast.success('Redirecting to Payment Provider', {
        description: 'Please complete your payment to top up your wallet.',
      });

      // Delay to simulate
      await new Promise((r) => setTimeout(r, 1500));
    } catch (error) {
      toast.error('Error', {
        description: 'Could not initiate top-up. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <Card className="border-border/50 relative w-full max-w-md overflow-hidden shadow-sm">
      <div className="from-primary/50 to-primary absolute top-0 left-0 h-1 w-full bg-linear-to-r" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary rounded-full p-2">
              <Wallet className="h-5 w-5" />
            </div>
            <CardTitle>My Wallet</CardTitle>
          </div>
          <Badge variant="outline" className="font-mono">
            {currency}
          </Badge>
        </div>
        <CardDescription>Use your balance for seamless booking payments.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6 flex flex-col gap-1">
          <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            Current Balance
          </span>
          <span className="text-4xl font-bold tracking-tight">
            {formatCurrency(balance, currency)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <Plus className="mr-2 h-4 w-4" /> Top Up
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Top Up Wallet</DialogTitle>
                <CardDescription>Choose a package to add funds.</CardDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {WALLET_PRODUCTS.map((product) => (
                  <div
                    key={product.id}
                    className="hover:bg-muted/50 flex cursor-pointer flex-col rounded-xl border p-4 transition-colors active:scale-95"
                    onClick={() => handleTopUp(product.priceId)}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-semibold">{product.title}</span>
                      <span className="font-bold">
                        {formatCurrency(product.amountCents / 100, 'EUR')}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                      <span>{product.description}</span>
                      {product.bonusCents > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30"
                        >
                          +{formatCurrency(product.bonusCents / 100, 'EUR')} Bonus
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="w-full" size="lg">
            <History className="mr-2 h-4 w-4" /> History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
