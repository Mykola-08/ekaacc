
'use client';
import { useState } from 'react';
import { AppSidebar } from '@/components/eka/app-sidebar';
import { AppHeader } from '@/components/eka/app-header';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { MessagingPanel } from '@/components/eka/messaging/messaging-panel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatOpen, setChatOpen] = useState(false);

  return (
      <div className="flex w-full bg-background">
        <SidebarProvider>
            <Sidebar collapsible="icon">
              <AppSidebar />
            </Sidebar>
            <div className="flex flex-col w-full">
                <AppHeader onChatToggle={() => setChatOpen(!isChatOpen)} />
                <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 lg:p-12 lg:max-w-7xl mx-auto w-full">
                  {children}
                </main>
            </div>
        </SidebarProvider>
        <SidebarProvider open={isChatOpen} onOpenChange={setChatOpen}>
            <Sidebar side="right" collapsible="offcanvas" className="w-96">
                <MessagingPanel />
            </Sidebar>
        </SidebarProvider>
      </div>
  );
}
