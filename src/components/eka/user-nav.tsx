'use client';

;
;
;
import { Avatar, AvatarFallback, AvatarImage, Button, Dropdown, DropdownAction, DropdownContent, DropdownItem, DropdownList } from '@/components/keep';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { DataSourceIndicator } from '@/components/eka/data-source-indicator';
import { VipBadge } from '@/components/eka/vip-badge';
import { SubscriptionBadge } from '@/components/eka/subscription-badge';
import { useActiveSubscriptions } from '@/hooks/use-active-subscriptions';
import { Crown, LogOut, Settings, User, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';

export function UserNav() {
  const { appUser: currentUser, signOut } = useAuth();
  const router = useRouter();
  const { setTheme } = useTheme();
  const { hasLoyalty, hasVip } = useActiveSubscriptions(currentUser?.id);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (!currentUser) {
    return null;
  }
  
  const initials = currentUser.displayName?.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <Dropdown>
      <DropdownAction asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {currentUser.avatarUrl && <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName || ''} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {currentUser.isVip && currentUser.vipTier && (
            <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5">
              <Crown className="h-3.5 w-3.5 text-yellow-500" />
            </div>
          )}
        </Button>
      </DropdownAction>
      <DropdownContent className="w-64" align="end" forceMount>
        <DropdownList className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {currentUser.avatarUrl && <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName || ''} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-none">{currentUser.displayName}</p>
                {/* Subscription badges */}
                {hasLoyalty && <SubscriptionBadge type="loyalty" size="sm" showLabel={false} />}
                {hasVip && <SubscriptionBadge type="vip" size="sm" showLabel={false} />}
                {/* Old wallet VIP badge */}
                {currentUser.isVip && currentUser.vipTier && (
                  <VipBadge tier={currentUser.vipTier} variant="compact" />
                )}
              </div>
              <p className="text-xs leading-none text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
          </div>
        </DropdownList>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <DataSourceIndicator />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/account">
            <DropdownItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownItem>
          </Link>
          <Link href="/settings">
            <DropdownItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownItem>
                <DropdownItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownItem>
                <DropdownItem onClick={() => setTheme('system')}>
                  <Laptop className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}
