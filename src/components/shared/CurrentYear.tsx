'use client';

import { Suspense } from 'react';

function YearValue() {
  return <>{new Date().getFullYear()}</>;
}

export function CurrentYear() {
  return (
    <Suspense fallback="2025">
      <YearValue />
    </Suspense>
  );
}
