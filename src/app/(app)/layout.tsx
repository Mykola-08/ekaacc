'use client';
import { AppSidebar } from '@/components/eka/app-sidebar';
import { AppHeader } from '@/components/eka/app-header';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MessagingPanel } from '@/components/eka/messaging/messaging-panel';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    // You can render a loading spinner or skeleton here
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-lg">Loading...</div>
        </div>
    )
  }

  return (
      <SidebarProvider>
        <Sidebar>
          <AppSidebar />
        </Sidebar>
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
  );
}
