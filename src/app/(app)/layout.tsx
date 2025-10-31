'use client';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { AIAssistant } from '@/components/eka/ai-assistant';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/eka/app-header';
import { AppSidebar } from '@/components/eka/app-sidebar';
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

  if (!mounted || loading) {
    // Render a placeholder or null on the server to avoid layout shift
    return <div className="relative flex min-h-screen w-full bg-background"></div>;
  }

  // Don't render content if no user (will redirect)
  if (!user) {
    return <div className="relative flex min-h-screen w-full bg-background"></div>;
  }

  return (
    <div className="relative flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar />
      {/* Main content area that adapts to sidebar state */}
      <div 
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          // On mobile, take full width (sidebar is overlay)
          // On desktop, add left margin based on sidebar state
          isMobile 
            ? "ml-0" 
            : isExpanded 
              ? "ml-[var(--sidebar-w)]" 
              : "ml-[var(--sidebar-w-collapsed)]"
        )}
      >
        <AppHeader />
        <main className="flex-1 p-4 lg:p-6 mt-[var(--header-h)] min-h-[calc(100vh-var(--header-h))]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppLayoutContent>
          {children}
        </AppLayoutContent>
        <AIAssistant />
      </SidebarProvider>
    </AuthProvider>
  );
}
