'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDownIcon, PlusSignIcon, ActivityIcon } from '@hugeicons/core-free-icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/platform/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/platform/ui/sidebar';

export function TeamSwitcher() {
  const { isMobile } = useSidebar();

  const activeTeam = {
    name: 'EKA Account',
    logo: ActivityIcon,
    plan: 'Wellness',
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-14 rounded-[20px] transition-all duration-200"
            >
              <div className="bg-primary text-primary-foreground flex aspect-square size-9 items-center justify-center rounded-xl shadow-md">
                <HugeiconsIcon icon={activeTeam.logo} className="size-5" strokeWidth={2.5} />
              </div>
              <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                <span className="text-foreground truncate font-bold">{activeTeam.name}</span>
                <span className="text-muted-foreground truncate text-xs">{activeTeam.plan}</span>
              </div>
              <HugeiconsIcon
                icon={ArrowDownIcon}
                className="ml-auto opacity-50"
                strokeWidth={2.5}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border-border/50 w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-[20px] p-2 shadow-xl backdrop-blur-md"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={12}
          >
            <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-[10px] font-bold tracking-widest uppercase opacity-50">
              Accounts
            </DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer gap-3 rounded-xl p-2">
              <div className="border-border/50 bg-secondary/50 flex size-8 items-center justify-center rounded-lg border">
                <HugeiconsIcon
                  icon={activeTeam.logo}
                  className="size-4 shrink-0"
                  strokeWidth={2.5}
                />
              </div>
              <span className="font-semibold">{activeTeam.name}</span>
              <DropdownMenuShortcut className="ml-auto text-[10px] font-bold opacity-50">
                ⌘1
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem className="hover:bg-primary/5 group cursor-pointer gap-3 rounded-xl p-2">
              <div className="border-border group-hover:border-primary/50 flex size-8 items-center justify-center rounded-lg border border-dashed transition-colors">
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  className="group-hover:text-primary size-4 opacity-50 transition-all group-hover:opacity-100"
                  strokeWidth={2.5}
                />
              </div>
              <div className="text-muted-foreground group-hover:text-primary font-semibold transition-colors">
                Add Account
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
