'use client';
import { useAuth } from '@/lib/supabase-auth';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/navigation/ShadcnSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/eka/app-header';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Auth is provided by the root layout, no need to wrap again
  return (
    <AppLayoutContent>
      {children}
    </AppLayoutContent>
  );
}