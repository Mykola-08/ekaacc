import { AppSidebar } from '@/components/eka/app-sidebar';
import { AppHeader } from '@/components/eka/app-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AppSidebar />
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 lg:p-12 lg:max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
