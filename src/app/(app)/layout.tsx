
'use client';
import { AppSidebar } from '@/components/eka/app-sidebar';
import { AppHeader } from '@/components/eka/app-header';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { AiAssistant } from '@/components/eka/dashboard/ai-assistant';
import { cn } from '@/lib/utils';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300 ease-in-out",
        "md:ml-[var(--sidebar-w-collapsed)] group-data-[state=expanded]:md:ml-[var(--sidebar-w)]"
      )}>
        <AppHeader />
        <main className="flex-1 overflow-y-auto pt-[var(--header-h)]">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <AiAssistant />
    </div>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
