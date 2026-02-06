"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserCheck01Icon,
  Notification03Icon,
  ArrowDownIcon,
  CreditCardIcon,
  Logout01Icon,
  SharingIcon
} from "@hugeicons/core-free-icons"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/platform/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/platform/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/platform/ui/sidebar"
import { useAuth } from "@/context/platform/auth-context"
import { useRouter } from "next/navigation"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) return null

  const userData = {
    name: user.profile?.full_name || user.email || "User",
    email: user.email || "",
    avatar: user.profile?.avatar_url || "",
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
              <Avatar className="h-9 w-9 rounded-xl border border-border/50">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                <span className="truncate font-semibold text-foreground">{userData.name}</span>
                <span className="truncate text-xs text-muted-foreground">{userData.email}</span>
              </div>
              <HugeiconsIcon icon={ArrowDownIcon} className="ml-auto size-4 opacity-50" strokeWidth={2.5} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-3xl p-2 shadow-xl border-border/50 backdrop-blur-md"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={12}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-xl border border-border/50">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary">
                    {userData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-foreground">{userData.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup className="gap-1 flex flex-col">
              <DropdownMenuItem className="rounded-xl h-10 cursor-pointer">
                <HugeiconsIcon icon={SharingIcon} className="mr-3 h-4 w-4 text-amber-500" strokeWidth={2.5} />
                <span className="font-semibold">Upgrade to Pro</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup className="gap-1 flex flex-col">
              <DropdownMenuItem className="rounded-xl h-10 cursor-pointer">
                <HugeiconsIcon icon={UserCheck01Icon} className="mr-3 h-4 w-4" strokeWidth={2.5} />
                <span className="font-medium">Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl h-10 cursor-pointer">
                <HugeiconsIcon icon={CreditCardIcon} className="mr-3 h-4 w-4" strokeWidth={2.5} />
                <span className="font-medium">Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl h-10 cursor-pointer">
                <HugeiconsIcon icon={Notification03Icon} className="mr-3 h-4 w-4" strokeWidth={2.5} />
                <span className="font-medium">Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem 
              className="rounded-xl h-10 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
              onClick={async () => {
                await signOut()
                router.push('/logout')
              }}
            >
              <HugeiconsIcon icon={Logout01Icon} className="mr-3 h-4 w-4" strokeWidth={2.5} />
              <span className="font-bold">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
