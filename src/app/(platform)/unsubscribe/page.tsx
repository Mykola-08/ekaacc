export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UnsubscribeContent from './UnsubscribeContent';

export default function UnsubscribePage() {
  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Unsubscribe</CardTitle>
          <CardDescription>Manage your email preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="bg-muted h-20 animate-pulse rounded" />}>
            <UnsubscribeContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
