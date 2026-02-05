'use client';

import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Notification01Icon, UserCircle02Icon } from '@hugeicons/core-free-icons';

const IconSearch = (props: any) => <HugeiconsIcon icon={Search01Icon} {...props} />;
const IconBell = (props: any) => <HugeiconsIcon icon={Notification01Icon} {...props} />;
const IconUserCircle = (props: any) => <HugeiconsIcon icon={UserCircle02Icon} {...props} />;

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-30">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-primary transition-colors" />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-sm font-semibold tracking-tight text-foreground/80">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
         <div className="relative group hidden md:block">
            <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search therapies..."
              className="h-9 w-64 bg-primary/5 border-none rounded-full pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary/20 transition-all outline-none"
            />
         </div>
         <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
            <IconBell size={20} />
         </Button>
         <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
            <IconUserCircle size={20} />
         </Button>
      </div>
    </header>
  );
}
