'use client';

import { useState } from 'react';
import { verifyBookingIdentity } from '@/server/finance/actions';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/morphing-toaster';
import { CheckCircle } from 'lucide-react';

export function VerifyButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await verifyBookingIdentity(bookingId);
      if (res.success) {
        toast.success('Identity verified successfully');
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      onClick={onClick}
      disabled={loading}
      className="bg-success text-success-foreground transition-all hover:bg-success/90 active:scale-95"
    >
      {loading ? (
        <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <CheckCircle className="mr-1 h-4 w-4" />
      )}
      Verify
    </Button>
  );
}
