'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (sessionId) {
      setStatus('success');
      // In a real app, you might verify the session here
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-700">Booking Confirmed!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">
          Thank you for your booking. You will receive a confirmation email shortly.
        </p>
        <div className="flex justify-center">
          <Link href="/">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Return to Home
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
