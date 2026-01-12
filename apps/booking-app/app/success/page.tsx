'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
 return (
  <div className="w-full max-w-md text-center bg-card border border-border rounded-[1.5rem] p-8 shadow-2xl animate-scale-in">
   <div className="flex justify-center mb-6">
    <div className="size-20 rounded-full bg-muted border border-border flex items-center justify-center shadow-lg">
     <CheckCircle2 className="h-10 w-10 text-primary" />
    </div>
   </div>
   <h1 className="text-3xl font-serif text-foreground mb-4">Booking Confirmed</h1>
   <p className="text-muted-foreground mb-8 leading-relaxed">
    Thank you for your booking. You will receive a confirmation email shortly with all the details.
   </p>
   <div className="flex justify-center">
    <Link href="/">
     <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-full text-base font-bold tracking-wide shadow-lg shadow-primary/20">
      Return to Home
     </Button>
    </Link>
   </div>
  </div>
 );
}

export default function SuccessPage() {
 return (
  <div className="min-h-screen flex items-center justify-center bg-background p-4 font-display animate-fade-in">
   <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
    <SuccessContent />
   </Suspense>
  </div>
 );
}
