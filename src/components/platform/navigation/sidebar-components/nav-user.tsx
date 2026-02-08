'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserCheck01Icon,
  Notification03Icon,
  ArrowDownIcon,
  CreditCardIcon,
  Logout01Icon,
  SharingIcon,
} from '@hugeicons/core-free-icons';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/platform/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/platform/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/platform/ui/sidebar';
import { useAuth } from '@/context/platform/auth-context';
import { useRouter } from 'next/navigation';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const userData = {
    name: user.profile?.full_name || user.email || 'User',
    email: user.email || '',
    avatar: user.profile?.avatar_url || '',
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
              <Avatar className="border-border/50 h-9 w-9 rounded-xl border">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="bg-primary/10 text-primary rounded-xl">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                <span className="text-foreground truncate font-semibold">{userData.name}</span>
                <span className="text-muted-foreground truncate text-xs">{userData.email}</span>
              </div>
              <HugeiconsIcon
                icon={ArrowDownIcon}
                className="ml-auto size-4 opacity-50"
                strokeWidth={2.5}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border-border/50 w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-[20px] p-2 shadow-xl backdrop-blur-md"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={12}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm">
                <Avatar className="border-border/50 h-10 w-10 rounded-xl border">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="bg-primary/10 text-primary rounded-xl">
                    {userData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="text-foreground truncate font-bold">{userData.name}</span>
                  <span className="text-muted-foreground truncate text-xs">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup className="flex flex-col gap-1">
              <DropdownMenuItem className="h-10 cursor-pointer rounded-xl">
                <HugeiconsIcon
                  icon={SharingIcon}
                  className="mr-3 h-4 w-4 text-amber-500"
                  strokeWidth={2.5}
                />
                <span className="font-semibold">Upgrade to Pro</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup className="flex flex-col gap-1">
              <DropdownMenuItem className="h-10 cursor-pointer rounded-xl">
                <HugeiconsIcon icon={UserCheck01Icon} className="mr-3 h-4 w-4" strokeWidth={2.5} />
                <span className="font-medium">Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="h-10 cursor-pointer rounded-xl">
                <HugeiconsIcon icon={CreditCardIcon} className="mr-3 h-4 w-4" strokeWidth={2.5} />
                <span className="font-medium">Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="h-10 cursor-pointer rounded-xl">
                <HugeiconsIcon
                  icon={Notification03Icon}
                  className="mr-3 h-4 w-4"
                  strokeWidth={2.5}
                />
                <span className="font-medium">Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/5 h-10 cursor-pointer rounded-xl"
              onClick={async () => {
                await signOut();
                router.push('/logout');
              }}
            >
              <HugeiconsIcon icon={Logout01Icon} className="mr-3 h-4 w-4" strokeWidth={2.5} />
              <span className="font-bold">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
