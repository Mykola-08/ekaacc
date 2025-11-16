'use client';
import { AuthProvider, useAuth } from '@/lib/supabase-auth';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { MinimalistSidebar } from '@/components/navigation/MinimalistSidebar';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/keep';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (!mounted || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Spinner size="xl" color="primary" className="mx-auto mb-4" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-minimal-background">
      <MinimalistSidebar />
      <main className="min-h-screen lg:ml-64 transition-all duration-300 ease-in-out">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppLayoutContent>
        {children}
      </AppLayoutContent>
    </AuthProvider>
  );
}