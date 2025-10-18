'use client';

import {
  Bell,
  Search,
  MessageSquare,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';

export function AppHeader() {
  const { setOpenMobile } = useSidebar();

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-transparent px-4 lg:h-[64px] lg:px-6 sticky top-0 z-30 glass">
       <SidebarTrigger className="md:hidden">
          <Menu className="h-6 w-6" />
      </SidebarTrigger>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search EKA..."
              className="w-full appearance-none bg-background/80 pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
       <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
       </Button>
       
       <SidebarTrigger>
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Toggle messages</span>
        </SidebarTrigger>


      <UserNav />
       <SidebarTrigger>
            <Menu className="h-6 w-6" />
       </SidebarTrigger>
    </header>
  );
}
