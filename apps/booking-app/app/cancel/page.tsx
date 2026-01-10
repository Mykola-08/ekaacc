'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

function CancelContent() {
  return (
    <div className="w-full max-w-md text-center bg-surface border border-border-subtle rounded-3xl p-8 shadow-2xl">
      <div className="flex justify-center mb-6">
        <div className="size-20 rounded-full bg-surface-highlight border border-border-subtle flex items-center justify-center shadow-lg">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
      </div>
      <h1 className="text-3xl font-serif text-slate-100 mb-4">Booking Cancelled</h1>
      <p className="text-slate-400 mb-8 leading-relaxed">
        Your payment was not processed and your booking has not been confirmed. No charges were made.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/">
          <Button variant="outline" className="border-border-subtle hover:bg-surface-highlight hover:text-slate-100 px-8 py-6 rounded-full text-base font-bold">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark p-4 font-display">
      <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
        <CancelContent />
      </Suspense>
    </div>
  );
}
