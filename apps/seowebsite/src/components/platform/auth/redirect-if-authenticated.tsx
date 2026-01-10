"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/hooks/platform/use-simple-auth';

export default function RedirectIfAuthenticated() {
  const { isAuthenticated, user } = useSimpleAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      if (!user?.personalizationCompleted) {
        router.replace('/onboarding');
        return;
      }
      router.replace('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  return null;
}
