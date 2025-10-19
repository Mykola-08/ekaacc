'use client';
import { useState } from 'react';
import { AppSidebar } from '@/components/eka/app-sidebar';
import { AppHeader } from '@/components/eka/app-header';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { MessagingPanel } from '@/components/eka/messaging/messaging-panel';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatOpen, setChatOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          "md:group-data-[state=expanded]:ml-[var(--sidebar-w)]",
          "md:group-data-[state=collapsed]:ml-[var(--sidebar-w-collapsed)]"
        )}>
          <AppHeader onChatToggle={() => setChatOpen(prev => !prev)} />
          <main className="flex-1 overflow-y-auto pt-[var(--header-h)]">
            <div className="mx-auto w-full max-w-[var(--layout-max)] p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>

        {isChatOpen && (
           <SidebarProvider open={isChatOpen} onOpenChange={setChatOpen}>
             <Sidebar side="right" collapsible="offcanvas" className="w-full max-w-[var(--chat-w)] glass">
                <MessagingPanel />
             </Sidebar>
           </SidebarProvider>
        )}
      </div>
    </SidebarProvider>
  );
}
