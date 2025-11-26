'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the auth app's onboarding page
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.ekaacc.com';
    window.location.href = `${authUrl}/onboarding`;
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Redirecting to onboarding...</div>
    </div>
  );
}
