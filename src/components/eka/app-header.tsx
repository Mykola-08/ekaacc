
'use client';

import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
import { ThemeToggle } from './theme-toggle';
import { NotificationCenter } from './notification-center';
import { PersonalizationBanner } from './personalization-banner';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useData } from '@/context/unified-data-context';

export function AppHeader() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { currentUser } = useData();

  const showPersonalizationBanner = currentUser && !currentUser.personalizationCompleted;

  return (
    <>
      {showPersonalizationBanner && <PersonalizationBanner />}
      <header className={cn(
        "flex h-[var(--header-h)] items-center gap-4 px-4 md:px-6 fixed left-0 w-full z-50 transition-all duration-300 ease-in-out glass border-b",
        showPersonalizationBanner ? "top-[60px]" : "top-0"
      )}>
        <div className="flex items-center">
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
        </div>
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search EKA..."
                className="w-full appearance-none bg-background/50 pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
        <NotificationCenter />
        <ThemeToggle />
        <UserNav />
      </header>
    </>
  );
}
