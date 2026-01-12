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
        <Button variant="outline" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border border-background"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl p-2 bg-card text-foreground border-border">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer rounded-lg p-3 hover:bg-muted/50 transition-colors">
          <div className="flex flex-col gap-1">
             <span className="font-medium text-sm">Welcome to EKA Balance</span>
             <span className="text-xs text-muted-foreground">Get started with your first booking.</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-lg p-3 hover:bg-muted/50 transition-colors">
          <div className="flex flex-col gap-1">
             <span className="font-medium text-sm">Profile Incomplete</span>
             <span className="text-xs text-muted-foreground">Please complete your profile details.</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
