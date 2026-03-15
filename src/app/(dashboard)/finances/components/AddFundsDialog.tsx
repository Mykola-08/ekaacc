'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCardAddIcon, Rocket01Icon } from '@hugeicons/core-free-icons';

import { HugeiconsIcon } from '@hugeicons/react';
import { useCheckout } from '@paykit-sdk/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function AddFundsDialog({ children }: { children: React.ReactNode }) {
  const [amount, setAmount] = useState('50');
  const [open, setOpen] = useState(false);
  const { create } = useCheckout();

  const handleCheckout = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const [data, error] = await create.run({
        session_type: 'one_time',
        item_id: 'price_mock_funds',
        quantity: 1,
        customer: { email: 'user@example.com' },
        metadata: { source: 'dashboard_add_funds', amount },
        cancel_url: window.location.href,
        success_url: window.location.href + '?success=true',
      });

      if (error) {
        toast.error('Failed to initialize checkout');
        console.error(error);
        return;
      }

      if (data?.payment_url) {
        window.open(data.payment_url, '_blank');
        setOpen(false);
      }
    } catch (e) {
      toast.error('Unexpected error occurred');
    }
  };

  const presetAmounts = ['25', '50', '100', '250'];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={CreditCardAddIcon} className="h-5 w-5 text-primary" />
            Add Funds to Wallet
          </DialogTitle>
          <DialogDescription>
            Boost your account balance to easily pay for upcoming sessions or shop items.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex gap-2">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                variant={amount === preset ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setAmount(preset)}
              >
                ${preset}
              </Button>
            ))}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Custom Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCheckout} disabled={create.loading} className="gap-2">
            {create.loading ? 'Processing...' : `Pay $${amount || '0'}`}
            {!create.loading && <HugeiconsIcon icon={Rocket01Icon} className="h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
