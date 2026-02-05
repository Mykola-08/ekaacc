'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Star, Shield, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { buyPlan } from "@/server/plans/actions";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

interface Plan {
    id: string;
    name: string;
    description: string;
    price_cents: number;
    credits_total: number;
    metadata: any;
}

export function PlanMarketplace({ plans }: { plans: Plan[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();

    const handlePurchase = async (plan: Plan) => {
        if (!confirm(`Confirm purchase of ${plan.name} for €${plan.price_cents / 100}?`)) return;

        setLoadingId(plan.id);
        const res = await buyPlan(plan.id);

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Plan purchased successfully!");
            router.refresh();
        }
        setLoadingId(null);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {plans.map(plan => {
                const isVIP = plan.name.includes("VIP");
                return (
                    <div key={plan.id} className={cn(
                        "relative overflow-hidden transition-all duration-300 group flex flex-col justify-between",
                        "p-6 rounded-2xl border shadow-sm hover:shadow-xl",
                        isVIP 
                            ? "bg-card border-amber-200 shadow-amber-100/50 hover:shadow-amber-200/50 hover:-translate-y-1" 
                            : "bg-card border-border hover:shadow-md hover:-translate-y-1"
                    )}>
                        {isVIP && (
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-60" />
                        )}
                        
                        <div className="relative z-10 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-110", 
                                    isVIP ? "bg-amber-50 text-amber-600" : "bg-card text-foreground"
                                )}>
                                    {isVIP ? <Sparkles className="w-6 h-6 fill-amber-100" /> : <Shield className="w-6 h-6" strokeWidth={2} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-foreground tracking-tight">{plan.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", isVIP ? "bg-amber-500" : "bg-blue-500")} />
                                        <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">{plan.credits_total} Sessions</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm leading-relaxed min-h-[40px] font-medium">{plan.description}</p>
                            
                            <div className="flex items-center gap-2 py-2">
                                <span className={cn("text-4xl font-bold tracking-tighter", isVIP ? "text-amber-950" : "text-foreground")}>€{plan.price_cents / 100}</span>
                                <span className="text-sm font-bold text-muted-foreground">/ bundle</span>
                            </div>
                        </div>

                        <div className="mt-6 relative z-10">
                            <Button
                                className={cn(
                                    "w-full rounded-lg font-bold h-12 text-base transition-all active:scale-95",
                                    isVIP 
                                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/25" 
                                        : "bg-foreground text-background hover:bg-foreground/90 shadow-lg"
                                )}
                                onClick={() => handlePurchase(plan)}
                                disabled={!!loadingId}
                            >
                                {loadingId === plan.id ? "Processing..." : "Purchase Plan"}
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
