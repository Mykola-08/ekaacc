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
            <Card className="p-5 bg-[#FEFFFE] border-[#F5F5F5] rounded-[32px] overflow-hidden group hover:shadow-md transition-all shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#222222]" strokeWidth={2.5} />
                        <span className="text-[11px] font-bold text-[#999999] uppercase tracking-wider">Credits</span>
                    </div>
                    <span className="text-[15px] font-bold text-[#222222]">{remaining}/{total}</span>
                </div>
                <Progress value={percent} className="h-2 rounded-full bg-[#F7F8F9]" indicatorClassName="bg-[#222222]" />
            </Card>
        );
    }

    return (
        <Card className="p-6 bg-[#FEFFFE] border-[#F5F5F5] rounded-[32px] overflow-hidden relative shadow-sm hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-blue-50/50 to-transparent pointer-events-none rounded-tr-[32px]" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shadow-sm ${isVIP ? 'bg-amber-50 text-amber-600' : 'bg-[#F7F8F9] text-[#222222]'}`}>
                        {isVIP ? <Crown className="w-6 h-6 fill-current" /> : <Zap className="w-6 h-6" strokeWidth={2.5} />}
                    </div>
                    <div>
                        <div className="font-bold text-lg text-[#222222] tracking-tight leading-tight">{usage.name}</div>
                        <div className="text-[13px] text-[#999999] font-medium mt-0.5">Active Plan</div>
                    </div>
                </div>
                <div className="text-3xl font-bold text-[#222222] tracking-tight">{remaining}<span className="text-base text-[#999999] font-medium ml-1">/{total}</span></div>
            </div>

            <div className="relative z-10 space-y-2">
                <div className="flex justify-between text-[11px] uppercase font-bold text-[#999999] tracking-wider">
                    <span>Usage</span>
                    <span>{Math.round(percent)}%</span>
                </div>
                <Progress 
                    value={percent} 
                    className={`h-3 rounded-full bg-[#F7F8F9] border border-[#F5F5F5]`} 
                    indicatorClassName={`${isVIP ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-[#222222] shadow-[0_0_10px_rgba(0,0,0,0.1)]'}`} 
                />
            </div>

            <div className="mt-6 pt-4 border-t border-[#F5F5F5] relative z-10">
                <p className="text-[13px] text-[#555555] font-medium text-center bg-[#F9F9F8] py-2 rounded-[12px]">
                    Expires on <span className="text-[#222222] font-bold">{new Date(usage.expires_at).toLocaleDateString()}</span>
                </p>
            </div>
        </Card>
    );
}
