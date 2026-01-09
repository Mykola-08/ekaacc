'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export function StripePaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Payment simulated successfully');
    onSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="p-4 border rounded bg-gray-50 text-center text-gray-500">
        Stripe Payment Disabled. Click below to simulate success.
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Processing...' : 'Pay Now (Simulated)'}
      </Button>
    </form>
  );
}
