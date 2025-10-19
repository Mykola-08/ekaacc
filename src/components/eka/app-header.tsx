'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <header className="flex h-[var(--header-h)] items-center gap-4 border-b bg-background/95 backdrop-blur px-4 md:px-6 fixed top-0 w-full z-50">
      {isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setOpenMobile(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open Sidebar</span>
        </Button>
      ) : (
        <SidebarTrigger />
      )}

      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search EKA..."
              className="w-full appearance-none bg-muted pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>

      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Toggle notifications</span>
      </Button>

      <UserNav />
    </header>
  );
}
