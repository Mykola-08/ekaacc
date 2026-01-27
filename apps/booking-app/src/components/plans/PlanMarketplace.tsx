'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star, Shield, Zap } from "lucide-react";
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
                    <Card key={plan.id} className={cn(
                        "relative overflow-hidden border-2 transition-all hover:scale-[1.02]",
                        isVIP ? "border-amber-400/50 bg-amber-50/10" : "border-border"
                    )}>
                        {isVIP && (
                            <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-bl-xl">
                                BEST VALUE
                            </div>
                        )}

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isVIP ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600")}>
                                    {isVIP ? <Star className="w-6 h-6 fill-current" /> : <Shield className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">{plan.name}</h3>
                                    <div className="text-sm text-muted-foreground">{plan.credits_total} Sessions Included</div>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm min-h-[40px]">{plan.description}</p>

                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold">€{plan.price_cents / 100}</span>
                                <span className="text-muted-foreground text-sm">/ bundle</span>
                            </div>

                            <Button
                                className={cn("w-full rounded-xl font-bold h-12", isVIP ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20" : "")}
                                onClick={() => handlePurchase(plan)}
                                disabled={!!loadingId}
                            >
                                {loadingId === plan.id ? "Processing..." : "Buy Now"}
                            </Button>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
