'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';

function UnsubscribeContent() {
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
  } catch (e) {
   setStatus('error');
  }
 };

 if (!uid) {
  return <p>Invalid link.</p>;
 }

 if (status === 'success') {
  return (
   <div className="text-center">
    <p className="text-green-600 mb-4">You have been successfully unsubscribed.</p>
    <p className="text-sm text-muted-foreground">You can always resubscribe from your account settings.</p>
   </div>
  );
 }

 return (
  <div className="flex flex-col items-center gap-4">
   <p>Are you sure you want to unsubscribe from our marketing emails?</p>
   <Button onClick={handleUnsubscribe} disabled={status === 'loading'}>
    {status === 'loading' ? 'Processing...' : 'Confirm Unsubscribe'}
   </Button>
   {status === 'error' && <p className="text-red-500">Something went wrong. Please try again.</p>}
  </div>
 );
}

export default function UnsubscribePage() {
 return (
  <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
   <Card className="w-full max-w-md">
    <CardHeader>
     <CardTitle>Unsubscribe</CardTitle>
     <CardDescription>Manage your email preferences</CardDescription>
    </CardHeader>
    <CardContent>
     <Suspense fallback={<div>Loading...</div>}>
      <UnsubscribeContent />
     </Suspense>
    </CardContent>
   </Card>
  </div>
 );
}
