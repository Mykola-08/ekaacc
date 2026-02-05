'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Shield, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/layout/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";

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

export function PermissionManager({ userId, userName, initialPermissions }: PermissionManagerProps) {
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

        toast.info("Permission toggle logic to be connected to server action.");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <DashboardHeader
                title={`${userName} Permissions`}
                subtitle="Manage specific access rights and overrides."
            />

            <div className="grid grid-cols-1 gap-4">
                {permissions.map(p => (
                    <div key={p.id} className="bg-card p-4 rounded-2xl border border-border/60 flex items-center justify-between group hover:bg-secondary/20 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                p.hasAccess
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-red-50 text-red-600"
                            )}>
                                {p.hasAccess ? <Check className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                            </div>
                            <div>
                                <div className="font-semibold text-foreground flex items-center gap-2">
                                    {p.code}
                                    {p.source === 'role' && <span className="text-[10px] uppercase bg-secondary px-2 py-0.5 rounded-full text-muted-foreground font-bold">Role Default</span>}
                                    {p.source === 'override' && <span className="text-[10px] uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Override</span>}
                                </div>
                                <div className="text-sm text-muted-foreground">{p.description}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant={p.hasAccess && p.source === 'override' ? "default" : "outline"}
                                className={cn("rounded-full", p.hasAccess && p.source === 'override' ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                                onClick={() => handleToggle(p.id, true, p.source)}
                            >
                                Grant
                            </Button>
                            <Button
                                size="sm"
                                variant={!p.hasAccess && p.source === 'override' ? "destructive" : "outline"}
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
