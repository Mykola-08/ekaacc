"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDownUpIcon, PlusSignIcon, ActivityIcon } from "@hugeicons/core-free-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/platform/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/platform/ui/sidebar"

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  
  const activeTeam = {
    name: "EKA Account",
    logo: ActivityIcon,
    plan: "Wellness",
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-14 rounded-2xl data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200"
            >
              <div className="bg-primary text-primary-foreground flex aspect-square size-9 items-center justify-center rounded-xl shadow-md">
                <HugeiconsIcon icon={activeTeam.logo} className="size-5" strokeWidth={2.5} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                <span className="truncate font-bold text-foreground">{activeTeam.name}</span>
                <span className="truncate text-xs text-muted-foreground">{activeTeam.plan}</span>
              </div>
              <HugeiconsIcon icon={ArrowDownUpIcon} className="ml-auto opacity-50" strokeWidth={2.5} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-3xl p-2 shadow-xl border-border/50 backdrop-blur-md"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={12}
          >
            <DropdownMenuLabel className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest px-2 py-1.5 opacity-50">
              Accounts
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-3 p-2 rounded-xl cursor-pointer"
            >
              <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary/50">
                <HugeiconsIcon icon={activeTeam.logo} className="size-4 shrink-0" strokeWidth={2.5} />
              </div>
              <span className="font-semibold">{activeTeam.name}</span>
              <DropdownMenuShortcut className="ml-auto text-[10px] font-bold opacity-50">⌘1</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem className="gap-3 p-2 rounded-xl cursor-pointer hover:bg-primary/5 group">
              <div className="flex size-8 items-center justify-center rounded-lg border border-dashed border-border group-hover:border-primary/50 transition-colors">
                <HugeiconsIcon icon={PlusSignIcon} className="size-4 opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" strokeWidth={2.5} />
              </div>
              <div className="text-muted-foreground font-semibold group-hover:text-primary transition-colors">Add Account</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
