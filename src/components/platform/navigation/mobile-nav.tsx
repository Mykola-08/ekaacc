'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserCircle, Menu, Monitor } from 'lucide-react';
import { cn } from '@/lib/platform/utils/css-utils';
import { useLayout } from '@/context/platform/layout-context';
import { Button } from '@/components/platform/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/platform/ui/dialog';
import { useState } from 'react';

export function MobileNav() {
  const pathname = usePathname();
  const { toggleFullVersion } = useLayout();
  const [showFullVersionDialog, setShowFullVersionDialog] = useState(false);

  const navItems = [
    {
      title: 'Home',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Profile',
      url: '/myaccount',
      icon: UserCircle,
    },
  ];

  return (
    <div className="bg-background pb-safe fixed right-0 bottom-0 left-0 z-50 border-t p-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.url;
          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                'hover:bg-accent hover:text-accent-foreground flex flex-col items-center justify-center gap-1 rounded-md p-2 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}

        <Dialog open={showFullVersionDialog} onOpenChange={setShowFullVersionDialog}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'hover:bg-accent hover:text-accent-foreground text-muted-foreground flex h-auto flex-col items-center justify-center gap-1 rounded-md p-2 text-xs font-medium transition-colors'
              )}
            >
              <Monitor className="h-5 w-5" />
              <span>Full Ver</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Switch to Desktop View?</DialogTitle>
              <DialogDescription>
                This will switch the layout to the full desktop version. You can switch back to
                mobile view in your settings.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFullVersionDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toggleFullVersion();
                  setShowFullVersionDialog(false);
                }}
              >
                Switch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
