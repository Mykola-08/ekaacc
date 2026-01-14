'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full relative shadow-sm hover:bg-muted">
          <Bell className="h-4 w-4" />
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl p-2 bg-card text-foreground border-border shadow-lg">
        <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-2" />
        <DropdownMenuItem className="cursor-pointer rounded-lg p-3 hover:bg-muted focus:bg-muted transition-colors my-1">
          <div className="flex flex-col gap-1.5">
             <span className="font-medium text-sm leading-none">Welcome to EKA Balance</span>
             <span className="text-xs text-muted-foreground">Get started with your first booking today.</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-lg p-3 hover:bg-muted focus:bg-muted transition-colors my-1">
          <div className="flex flex-col gap-1.5">
             <span className="font-medium text-sm leading-none">Profile Incomplete</span>
             <span className="text-xs text-muted-foreground">Please complete your profile details to continue.</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
