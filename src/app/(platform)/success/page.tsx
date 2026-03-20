export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { PaymentResult } from '@/components/payment/PaymentResult';

export default function Page() {
  return (
    <Suspense fallback={<div className="bg-background min-h-screen" />}>
      <PaymentResult status="success" />
    </Suspense>
  );
}
