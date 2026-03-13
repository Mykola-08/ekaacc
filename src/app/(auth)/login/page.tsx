import { LoginForm } from '@/components/platform/auth/login-form';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="auth-page">
      {/* Subtle Apple-like gradient background */}
      <div className="auth-page-gradient" />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
        <Suspense fallback={<div>Loading form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
