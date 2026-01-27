'use client';

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Crown } from "lucide-react";

export function PlanUsageCard({ usage }: { usage: any }) {
    if (!usage) return null;

    const total = usage.credits_total;
    const used = usage.credits_used;
    const remaining = total - used;
    const percent = (remaining / total) * 100;
    const isVIP = usage.name.includes('VIP');

    return (
        <Card className="p-6 bg-gradient-to-br from-background to-secondary/30 border-border rounded-[28px] overflow-hidden relative">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isVIP ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        {isVIP ? <Crown className="w-5 h-5 fill-current" /> : <Zap className="w-5 h-5 fill-current" />}
                    </div>
                    <div>
                        <div className="font-bold text-foreground">{usage.name}</div>
                        <div className="text-xs text-muted-foreground font-medium">Active Membership</div>
                    </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{remaining}<span className="text-sm text-muted-foreground font-normal">/{total} Left</span></div>
            </div>

            <Progress value={percent} className={`h-3 rounded-full ${isVIP ? 'bg-amber-100' : 'bg-blue-100'}`} indicatorClassName={isVIP ? 'bg-amber-500' : 'bg-blue-500'} />

            <p className="mt-4 text-xs text-muted-foreground text-center font-medium">
                Expires on {new Date(usage.expires_at).toLocaleDateString()}
            </p>
        </Card>
    );
}
