'use client';
import { AppSidebar } from '@/components/eka/app-sidebar';
import { AppHeader } from '@/components/eka/app-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UnifiedDataProvider } from '@/context/unified-data-context';
import { AIAssistant } from '@/components/eka/ai-assistant';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <UnifiedDataProvider>
          <div className="relative flex min-h-screen w-full bg-background">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
              <AppHeader />
              <main className="flex-1 p-4 lg:p-6">
                {children}
              </main>
            </div>
          </div>
          <AIAssistant />
      
      </UnifiedDataProvider>
    </SidebarProvider>
  );
}
