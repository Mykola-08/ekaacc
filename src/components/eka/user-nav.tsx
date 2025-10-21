'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useData } from '@/context/unified-data-context';
import { useRouter } from 'next/navigation';
import { RoleChanger } from '@/components/ui/role-changer';
import { DataSourceIndicator } from '@/components/eka/data-source-indicator';
import { VipBadge } from '@/components/eka/vip-badge';
import { Crown } from 'lucide-react';

export function UserNav() {
  const { currentUser, logout } = useData();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!currentUser) {
    return null;
  }
  
  const initials = currentUser.initials;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {currentUser.avatarUrl && <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {currentUser.isVip && currentUser.vipTier && (
            <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5">
              <Crown className="h-3.5 w-3.5 text-yellow-500" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="mb-2 px-2">
          <label className="text-xs text-muted-foreground">View</label>
          <select
            className="w-full mt-1 p-1 rounded bg-background/50 text-sm"
            defaultValue={currentUser.role}
            onChange={(e) => {
              const v = e.target.value;
              try { localStorage.setItem('eka_persona', v); } catch {}
              try { window.dispatchEvent(new CustomEvent('eka_persona_change', { detail: v })); } catch {}
              // update server-side role if available
              try { (useData() as any).updateUser?.({ role: v }); } catch {}
            }}
          >
            <option>Patient</option>
            <option>Therapist</option>
            <option>Admin</option>
          </select>
        </div>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{currentUser.name}</p>
              {currentUser.isVip && currentUser.vipTier && (
                <VipBadge tier={currentUser.vipTier} variant="compact" />
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/account">
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
          </Link>
           <Link href="/account/vip">
            <DropdownMenuItem>
              Billing
            </DropdownMenuItem>
          </Link>
          <Link href="/account">
            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>
          </Link>
          <Link href="/tools">
            <DropdownMenuItem>
              Test Tools
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <DataSourceIndicator />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
