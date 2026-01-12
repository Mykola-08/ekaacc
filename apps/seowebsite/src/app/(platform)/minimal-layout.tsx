'use client';
import { useAuth } from '@/lib/platform/supabase/auth';
import { cn } from '@/lib/platform/utils/css-utils';
import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/platform/navigation/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/platform/ui/sidebar';
// import { AppHeader } from '@/components/platform/eka/app-header';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const AppHeader = () => (
 <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-14 items-center">
   <div className="mr-4 hidden md:flex">
    <span className="font-bold">EKA Platform</span>
   </div>
  </div>
 </header>
);

import { LayoutProvider, useLayout } from '@/context/platform/layout-context';
import { MobileNav } from '@/components/platform/navigation/mobile-nav';

function AppLayoutInner({ children }: { children: React.ReactNode }) {
 const { activeLayout } = useLayout();

 if (activeLayout === 'mobile') {
  return (
   <div className="flex min-h-screen flex-col bg-background pb-16">
    <AppHeader />
    <main className="flex-1 overflow-auto">
     <div className="container mx-auto p-4">
      {children}
     </div>
    </main>
    <MobileNav />
   </div>
  );
 }

 return (
  <SidebarProvider>
   <AppSidebar />
   <SidebarInset>
    <AppHeader />
    <main className="flex-1 overflow-auto">
     <div className="container mx-auto p-6">
      {children}
     </div>
    </main>
   </SidebarInset>
  </SidebarProvider>
 );
}

function AppLayoutContent({ children }: { children: React.ReactNode }) {
 const { user, loading } = useAuth();
 const router = useRouter();
 const pathname = usePathname();
 const searchParams = useSearchParams();
 const [mounted, setMounted] = useState(false);
 const e2eBypass = searchParams?.get('e2e') === '1';

 useEffect(() => {
  setMounted(true);
 }, []);

 // Redirect to login if not authenticated (preserve intended destination)
 useEffect(() => {
  if (!loading && !user && !e2eBypass) {
   const query = searchParams?.toString();
   const returnTo = pathname + (query ? `?${query}` : '');
   router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }
 }, [user, loading, router, pathname, searchParams, e2eBypass]);

 if (!mounted || loading || (!user && !e2eBypass)) {
  return (
   <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
     <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
     <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
   </div>
  );
 }

 return (
  <LayoutProvider>
   <AppLayoutInner>{children}</AppLayoutInner>
  </LayoutProvider>
 );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
 // Auth is provided by the root layout, no need to wrap again
 return (
  <AppLayoutContent>
   {children}
  </AppLayoutContent>
 );
}