import { SignUpForm } from '@/components/platform/auth/signup-form';
import { Suspense } from 'react';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; ref?: string }>;
}) {
  const { plan } = await searchParams;

  return (
    <div className="auth-page">
      {/* Subtle Apple-like gradient background */}
      <div className="auth-page-gradient" />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
        <Suspense>
          <SignUpForm planId={plan} />
        </Suspense>
      </div>
    </div>
  );
}
