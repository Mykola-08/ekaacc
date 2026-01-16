'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wallet, Plus, CreditCard, History } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { WALLET_PRODUCTS } from '@/lib/stripe-products';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Dummy hook - replace with actual API integration
const useWallet = () => {
  // Mock data
  return {
    balance: 0,
    currency: 'EUR',
    isLoading: false,
    transactions: [] as any[]
  };
};

export function WalletCard() {
  const { balance, currency } = useWallet();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTopUp = async (priceId: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call to create Checkout Session
      // const res = await fetch('/api/checkout/wallet', { method: 'POST', body: JSON.stringify({ priceId }) });
      // const { url } = await res.json();
      // window.location.href = url;
      
      console.log('Redirecting to Stripe with Price ID:', priceId);
      toast.success("Redirecting to Payment Provider", {
        description: "Please complete your payment to top up your wallet.",
      });
      
      // Delay to simulate
      await new Promise(r => setTimeout(r, 1500));
      
    } catch (error) {
      toast.error("Error", {
        description: "Could not initiate top-up. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/50 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/50 to-primary" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Wallet className="w-5 h-5" />
            </div>
            <CardTitle>My Wallet</CardTitle>
          </div>
          <Badge variant="outline" className="font-mono">
            {currency}
          </Badge>
        </div>
        <CardDescription>
          Use your balance for seamless booking payments.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col gap-1 mb-6">
          <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Current Balance</span>
          <span className="text-4xl font-bold tracking-tight">
            {formatCurrency(balance, currency)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <Plus className="w-4 h-4 mr-2" /> Top Up
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
                    className="flex flex-col p-4 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer active:scale-[0.98]"
                    onClick={() => handleTopUp(product.priceId)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">{product.title}</span>
                      <span className="font-bold">{formatCurrency(product.amountCents / 100, 'EUR')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{product.description}</span>
                      {product.bonusCents > 0 && (
                        <Badge variant="secondary" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30">
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
             <History className="w-4 h-4 mr-2" /> History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
