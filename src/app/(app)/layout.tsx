'use client';
import { AuthProvider, useAuth } from '@/lib/supabase-auth';
import { AIAssistant } from '@/components/eka/ai-assistant';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/eka/app-header';
import { AppSidebar } from '@/components/eka/app-sidebar';
import { AppFooter } from '@/components/eka/app-footer';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isMobile, isExpanded } = useSidebar();
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
    // Render a full-page loader
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        {/* You can add a spinner or any loading animation here */}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full bg-background text-foreground apple-transition">
      <AppSidebar />
      <div className={cn(
        "flex flex-1 flex-col apple-transition",
        isExpanded ? "ml-80" : "ml-20"
      )}>
        <AppHeader />
        <main className="flex-1 overflow-y-auto apple-content">
          <div className="apple-container">
            {children}
          </div>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppLayoutContent>
          {children}
        </AppLayoutContent>
      </SidebarProvider>
    </AuthProvider>
  );
}
