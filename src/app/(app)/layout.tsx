
'use client';
import { AppSidebar } from '@/components/eka/app-sidebar';
import { AppHeader } from '@/components/eka/app-header';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MessagingPanel } from '@/components/eka/messaging/messaging-panel';
import { useUserContext } from '@/context/user-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useUserContext();
  
  if (!currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="text-center">
              <h1 className="text-2xl font-semibold">Authentication Error</h1>
              <p className="text-muted-foreground mt-2">Could not find user data. Please log in again.</p>
              <Button asChild className="mt-4">
                  <Link href="/">Return to Home</Link>
              </Button>
          </div>
      </div>
    )
  }


  return (
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <AppSidebar />
        </Sidebar>
        <SidebarProvider>
            <SidebarInset>
                <AppHeader />
                <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 lg:p-12 lg:max-w-7xl mx-auto w-full">
                  {children}
                </main>
            </SidebarInset>
            <Sidebar side="right" collapsible="offcanvas">
                <MessagingPanel />
            </Sidebar>
        </SidebarProvider>
      </SidebarProvider>
  );
}
