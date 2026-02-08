'use client';

import { useAuth } from '@/context/platform/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EducatorLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
      } else {
        const role = user.role?.name || user.user_metadata?.role;
        if (role !== 'Educator' && role !== 'Admin') {
          router.push('/dashboard');
        }
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b px-6 py-4">
        <h1 className="text-xl font-bold">Educator Dashboard</h1>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
