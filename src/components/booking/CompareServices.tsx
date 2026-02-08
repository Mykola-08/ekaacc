'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon, MinusPlus01Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function CompareServices() {
  return (
    <div className="bg-card border-border/60 animate-in slide-in-from-bottom-4 w-full overflow-hidden rounded-[24px] border shadow-none duration-700">
      <div className="border-border/40 bg-secondary/20 border-b p-8 text-center">
        <h2 className="text-foreground mb-2 font-serif text-2xl font-semibold">
          Compare Experiences
        </h2>
        <p className="text-muted-foreground">Find the perfect balance for your needs.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-border/40 border-b">
              <th className="w-1/4 p-6 text-left"></th>
              <th className="text-foreground w-1/4 p-6 text-center font-serif text-lg">Classic</th>
              <th className="text-primary bg-primary/5 w-1/4 rounded-t-xl p-6 text-center font-serif text-lg font-bold">
                Premium
              </th>
              <th className="text-foreground w-1/4 p-6 text-center font-serif text-lg">Royal</th>
            </tr>
          </thead>
          <tbody className="divide-border/40 divide-y">
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
            <FeatureRow
              label="Refreshments"
              classic="Water"
              premium="Generic Tea"
              royal="Premium Herbal Infusion"
            />
            <FeatureRow
              label="Consultation"
              classic="Standard"
              premium="In-depth"
              royal="Holistic Assessment"
            />
            <FeatureRow label="Post-Session Report" classic={false} premium={false} royal={true} />
          </tbody>
        </table>
      </div>
      <div className="bg-secondary/10 text-muted-foreground p-6 text-center text-xs">
        All sessions include usage of high-quality organic oils and showers.
      </div>
    </div>
  );
}

function FeatureRow({ label, tooltip, classic, premium, royal }: any) {
  const renderValue = (val: any) => {
    if (typeof val === 'boolean') {
      return val ? (
        <HugeiconsIcon icon={Tick02Icon} className="mx-auto h-5 w-5 text-emerald-500" />
      ) : (
        <HugeiconsIcon
          icon={MinusPlus01Icon}
          className="text-muted-foreground/30 mx-auto h-5 w-5"
        />
      );
    }
    return <span className="text-sm font-medium">{val}</span>;
  };

  return (
    <tr className="hover:bg-secondary/30 group transition-all">
      <td className="text-muted-foreground flex items-center gap-2 p-4 pl-8 text-sm font-semibold transition-all group-hover:pl-9">
        {label}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  className="text-muted-foreground/50 h-3.5 w-3.5"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </td>
      <td className="p-4 text-center">{renderValue(classic)}</td>
      <td className="bg-primary/5 text-foreground p-4 text-center font-medium">
        {renderValue(premium)}
      </td>
      <td className="p-4 text-center">{renderValue(royal)}</td>
    </tr>
  );
}
