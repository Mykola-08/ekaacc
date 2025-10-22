'use client';
import { AppSidebar } from '@/components/eka/app-sidebar';
import { AppHeader } from '@/components/eka/app-header';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { UnifiedDataProvider } from '@/context/unified-data-context';
import { AIAssistant } from '@/components/eka/ai-assistant';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isMobile, isExpanded } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full bg-background">
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
    <SidebarProvider>
      <UnifiedDataProvider>
        <AppLayoutContent>
          {children}
        </AppLayoutContent>
        <AIAssistant />
      </UnifiedDataProvider>
    </SidebarProvider>
  );
}
