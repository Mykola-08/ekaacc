'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AdminSidebarContent } from '@/components/admin/sidebar';
import { Menu, Sun, Bell } from 'lucide-react';
import { useState } from 'react';

export function AdminHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-card border-border flex h-16 shrink-0 items-center justify-between rounded-2xl border px-6">
      <div className="flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-card border-border w-[280px] rounded-r-[36px] border-r p-0"
          >
            {/* Pass onClick to close the sheet when a link is clicked */}
            <AdminSidebarContent onClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Sun className="text-muted-foreground h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="text-muted-foreground h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
