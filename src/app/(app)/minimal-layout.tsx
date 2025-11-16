'use client';
import { AuthProvider, useAuth } from '@/lib/supabase-auth';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { MinimalNav } from '@/components/ui/minimal-nav';
import { useRouter } from 'next/navigation';

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
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Home', href: '/home', active: false },
    { label: 'Dashboard', href: '/dashboard', active: false },
    { label: 'Sessions', href: '/sessions', active: false },
    { label: 'Progress', href: '/progress', active: false },
    { label: 'Messages', href: '/messages', active: false },
    { label: 'Settings', href: '/settings', active: false },
  ];

  return (
    <div className="min-h-screen bg-white">
      <MinimalNav 
        logoText="Therapy Platform"
        items={navItems}
        userMenu={true}
      />
      <main className="min-h-screen">
        {children}
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