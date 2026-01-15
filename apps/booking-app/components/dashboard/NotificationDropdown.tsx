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
        <Button variant="outline" size="icon" className="rounded-full relative border-black/10 hover:bg-black/5 shadow-sm">
          <Bell className="h-4 w-4 opacity-70" />
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 glass-panel shadow-xl shadow-black/5 mt-2">
        <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold tracking-tight opacity-70">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-2 bg-black/5" />
        <DropdownMenuItem className="cursor-pointer rounded-xl p-3 hover:bg-black/5 focus:bg-black/5 transition-colors my-1">
          <div className="flex flex-col gap-1.5">
             <span className="font-medium text-sm leading-none text-foreground/90">Welcome to EKA Balance</span>
             <span className="text-xs text-muted-foreground font-light">Get started with your first booking today.</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl p-3 hover:bg-black/5 focus:bg-black/5 transition-colors my-1">
          <div className="flex flex-col gap-1.5">
             <span className="font-medium text-sm leading-none text-foreground/90">Profile Incomplete</span>
             <span className="text-xs text-muted-foreground font-light">Please complete your profile details to continue.</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
