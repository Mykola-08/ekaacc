'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Shield, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard';

type PermissionItem = {
  id: string;
  code: string;
  description: string;
  hasAccess: boolean;
  source: 'role' | 'override' | 'none';
};

interface PermissionManagerProps {
  userId: string;
  userName: string;
  initialPermissions: PermissionItem[];
}

export function PermissionManager({
  userId,
  userName,
  initialPermissions,
}: PermissionManagerProps) {
  const [permissions, setPermissions] = useState(initialPermissions);

  const handleToggle = async (permissionId: string, currentAccess: boolean, source: string) => {
    // Optimistic UI Update
    // Logic:
    // If hasAccess=true (Role), clicking means Deny (Override=false).
    // If hasAccess=true (Override), clicking means Remove Override (Back to Default? or Deny?).
    // Let's keep it simple: Cycle -> Grant (Override) -> Inherit (Role) -> Deny (Override).
    // For MVP: Simple Toggle Grant/Deny override. If it matches role, remove override.

    // Actually, simplest is two buttons per permission: [Allow] [Deny] [Inherit]
    // But for a list view, a tri-state toggle is complex.
    // Let's implement [Grant] vs [Deny] overrides.

    toast.info('Permission toggle logic to be connected to server action.');
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <DashboardHeader
        title={`${userName} Permissions`}
        subtitle="Manage specific access rights and overrides."
      />

      <div className="grid grid-cols-1 gap-4">
        {permissions.map((p) => (
          <div
            key={p.id}
            className="bg-card border-border/60 group hover:bg-secondary/20 flex items-center justify-between rounded-2xl border p-4 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  p.hasAccess ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                )}
              >
                {p.hasAccess ? <Check className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
              <div>
                <div className="text-foreground flex items-center gap-2 font-semibold">
                  {p.code}
                  {p.source === 'role' && (
                    <span className="bg-secondary text-muted-foreground rounded-full px-2 py-0.5 text-xs font-bold uppercase">
                      Role Default
                    </span>
                  )}
                  {p.source === 'override' && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 uppercase">
                      Override
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground text-sm">{p.description}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={p.hasAccess && p.source === 'override' ? 'default' : 'outline'}
                className={cn(
                  'rounded-full',
                  p.hasAccess && p.source === 'override'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : ''
                )}
                onClick={() => handleToggle(p.id, true, p.source)}
              >
                Grant
              </Button>
              <Button
                size="sm"
                variant={!p.hasAccess && p.source === 'override' ? 'destructive' : 'outline'}
                className="rounded-full"
                onClick={() => handleToggle(p.id, false, p.source)}
              >
                Deny
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
