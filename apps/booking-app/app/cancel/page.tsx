'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

function CancelContent() {
 return (
  <div className="w-full max-w-md text-center bg-card border border-border rounded-[1.5rem] p-8 shadow-2xl animate-scale-in">
   <div className="flex justify-center mb-6">
    <div className="size-20 rounded-full bg-muted border border-border flex items-center justify-center shadow-lg">
     <AlertCircle className="h-10 w-10 text-destructive" />
    </div>
   </div>
   <h1 className="text-3xl font-serif text-foreground mb-4">Booking Cancelled</h1>
   <p className="text-muted-foreground mb-8 leading-relaxed">
    Your payment was not processed and your booking has not been confirmed. No charges were made.
   </p>
   <div className="flex justify-center gap-4">
    <Link href="/">
     <Button variant="outline" className="border-border hover:bg-muted hover:text-foreground px-8 py-6 rounded-full text-base font-bold">
      Back to Home
     </Button>
    </Link>
   </div>
  </div>
 );
}

export default function CancelPage() {
 return (
  <div className="min-h-screen flex items-center justify-center bg-background p-4 font-display animate-fade-in">
   <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
    <CancelContent />
   </Suspense>
  </div>
 );
}
