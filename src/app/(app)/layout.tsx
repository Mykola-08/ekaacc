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
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Navigation Sidebar */}
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <AppSidebar />
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <AppHeader onChatToggle={() => setChatOpen(!isChatOpen)} />
          <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </SidebarProvider>

      {/* Right Chat/Messaging Sidebar */}
      <SidebarProvider open={isChatOpen} onOpenChange={setChatOpen}>
        <Sidebar side="right" collapsible="offcanvas" className="w-full max-w-md">
          <MessagingPanel />
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
