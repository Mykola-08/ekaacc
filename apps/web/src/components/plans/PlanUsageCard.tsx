'use client';

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Crown } from "lucide-react";

export function PlanUsageCard({ usage, compact }: { usage: any, compact?: boolean }) {
    if (!usage) return null;

    const total = usage.credits_total;
    const used = usage.credits_used;
    const remaining = total - used;
    const percent = (remaining / total) * 100;
    const isVIP = usage.name?.includes('VIP');

    if (compact) {
        return (
            <Card className="p-5 bg-background border-border rounded-2xl overflow-hidden group hover:shadow-md transition-all shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-foreground" strokeWidth={2.5} />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Credits</span>
                    </div>
                    <span className="text-[15px] font-bold text-foreground">{remaining}/{total}</span>
                </div>
                <Progress value={percent} className="h-2 rounded-full bg-card" />
            </Card>
        );
    }

    return (
        <Card className="p-6 bg-background border-border rounded-2xl overflow-hidden relative shadow-sm hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-primary/10 to-transparent pointer-events-none rounded-tr-[32px]" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${isVIP ? 'bg-amber-50 text-amber-600' : 'bg-card text-foreground'}`}>
                        {isVIP ? <Crown className="w-6 h-6 fill-current" /> : <Zap className="w-6 h-6" strokeWidth={2.5} />}
                    </div>
                    <div>
                        <div className="font-bold text-lg text-foreground tracking-tight leading-tight">{usage.name}</div>
                        <div className="text-[13px] text-muted-foreground font-medium mt-0.5">Active Plan</div>
                    </div>
                </div>
                <div className="text-3xl font-bold text-foreground tracking-tight">{remaining}<span className="text-base text-muted-foreground font-medium ml-1">/{total}</span></div>
            </div>

            <div className="relative z-10 space-y-2">
                <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground tracking-wider">
                    <span>Usage</span>
                    <span>{Math.round(percent)}%</span>
                </div>
                <Progress 
                    value={percent} 
                    className={`h-3 rounded-full bg-card border border-border`} 
                    indicatorClassName={`${isVIP ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-foreground shadow-[0_0_10px_rgba(0,0,0,0.1)]'}`} 
                />
            </div>

            <div className="mt-6 pt-4 border-t border-border relative z-10">
                <p className="text-[13px] text-muted-foreground font-medium text-center bg-secondary py-2 rounded-lg">
                    Expires on <span className="text-foreground font-bold">{new Date(usage.expires_at).toLocaleDateString()}</span>
                </p>
            </div>
        </Card>
    );
}
