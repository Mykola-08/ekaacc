'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleUnsubscribe = async () => {
    if (!uid) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (!uid) {
    return <p>Invalid link.</p>;
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <p className="text-success mb-4">You have been successfully unsubscribed.</p>
        <p className="text-muted-foreground text-sm">
          You can always resubscribe from your account settings.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p>Are you sure you want to unsubscribe from our marketing emails?</p>
      <Button onClick={handleUnsubscribe} disabled={status === 'loading'}>
        {status === 'loading' ? 'Processing...' : 'Confirm Unsubscribe'}
      </Button>
      {status === 'error' && (
        <p className="text-destructive">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
