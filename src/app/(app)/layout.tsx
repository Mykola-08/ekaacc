import { AppSidebar } from '@/components/eka/app-sidebar';
import { AppHeader } from '@/components/eka/app-header';
import { UserProvider } from '@/context/user-context';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
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
      </SidebarProvider>
    </UserProvider>
  );
}
