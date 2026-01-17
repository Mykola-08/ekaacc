'use client';

import { Check, Minus, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function CompareServices() {
    return (
        <div className="w-full bg-card rounded-[32px] border border-border/60 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
            <div className="p-8 text-center border-b border-border/40 bg-secondary/20">
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">Compare Experiences</h2>
                <p className="text-muted-foreground">Find the perfect balance for your needs.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-b border-border/40">
                            <th className="p-6 text-left w-1/4"></th>
                            <th className="p-6 text-center w-1/4 font-serif text-lg text-foreground">Classic</th>
                            <th className="p-6 text-center w-1/4 font-serif text-lg text-primary font-bold bg-primary/5 rounded-t-xl">Premium</th>
                            <th className="p-6 text-center w-1/4 font-serif text-lg text-foreground">Royal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        <FeatureRow label="Duration" classic="60 min" premium="90 min" royal="120 min" />
                        <FeatureRow label="Hot Towel Treatment" classic={false} premium={true} royal={true} />
                        <FeatureRow label="Aromatherapy" classic={false} premium={true} royal={true} />
                        <FeatureRow
                            label="Private Suite Access"
                            tooltip="Access to our exclusive relaxation suite before and after session"
                            classic={false}
                            premium="Shared"
                            royal="Private"
                        />
                        <FeatureRow label="Refreshments" classic="Water" premium="Generic Tea" royal="Premium Herbal Infusion" />
                        <FeatureRow label="Consultation" classic="Standard" premium="In-depth" royal="Holistic Assessment" />
                        <FeatureRow label="Post-Session Report" classic={false} premium={false} royal={true} />
                    </tbody>
                </table>
            </div>
            <div className="p-6 bg-secondary/10 text-center text-xs text-muted-foreground">
                All sessions include usage of high-quality organic oils and showers.
            </div>
        </div>
    );
}

function FeatureRow({ label, tooltip, classic, premium, royal }: any) {
    const renderValue = (val: any) => {
        if (typeof val === 'boolean') {
            return val ? <Check className="w-5 h-5 mx-auto text-emerald-500" /> : <Minus className="w-5 h-5 mx-auto text-muted-foreground/30" />;
        }
        return <span className="text-sm font-medium">{val}</span>;
    };

    return (
        <tr className="hover:bg-secondary/30 transition-colors group">
            <td className="p-4 pl-8 group-hover:pl-9 transition-all text-sm font-semibold text-muted-foreground flex items-center gap-2">
                {label}
                {tooltip && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger><HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50" /></TooltipTrigger>
                            <TooltipContent><p>{tooltip}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </td>
            <td className="p-4 text-center">{renderValue(classic)}</td>
            <td className="p-4 text-center bg-primary/5 font-medium text-foreground">{renderValue(premium)}</td>
            <td className="p-4 text-center">{renderValue(royal)}</td>
        </tr>
    );
}
