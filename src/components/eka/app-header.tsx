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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { MessagingPanel } from './messaging/messaging-panel';

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
        <Sheet>
            <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="rounded-full">
                    <MessageSquare className="h-5 w-5" />
                    <span className="sr-only">Toggle messages</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] p-0">
                <MessagingPanel />
            </SheetContent>
        </Sheet>


      <UserNav />
       <SidebarTrigger className="ml-auto" />
    </header>
  );
}
