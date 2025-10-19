'use client';
import { AppSidebar } from '@/components/eka/app-sidebar';
import { AppHeader } from '@/components/eka/app-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AiAssistant } from '@/components/eka/dashboard/ai-assistant';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        <AppSidebar />
        
        <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out md:ml-[var(--sidebar-w-collapsed)] group-data-[state=expanded]:md:ml-[var(--sidebar-w)]">
          <AppHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 pt-[calc(var(--header-h)_+_1rem)] md:pt-[calc(var(--header-h)_+_1.5rem)] lg:pt-[calc(var(--header-h)_+_2rem)]">
              {children}
            </div>
          </main>
        </div>
        <AiAssistant />
      </div>
    </SidebarProvider>
  );
}
