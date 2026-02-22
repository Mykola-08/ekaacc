'use client';

import { toggleFeatureOverride } from '@/app/actions/admin';
import { Switch } from '@/components/ui/switch';
import { useTransition } from 'react';

export function FeatureOverrideList({ userId, enrollments, allFeatures }: any) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      {allFeatures.map((feature: any) => {
        const enrollment = enrollments.find((e: any) => e.feature_id === feature.id);
        // Visual state: if pending, might be stale, but optimistic UI is complex here without more code.
        const isEnabled = enrollment ? enrollment.enabled : feature.default_enabled;
        const isOverride = !!enrollment;

        return (
          <div key={feature.id} className="flex justify-between items-center border p-3 rounded-md bg-card">
            <div className="flex flex-col">
               <span className="font-mono text-sm font-medium">{feature.key}</span>
               <div className="flex gap-2 text-xs text-muted-foreground">
                 {feature.description}
                 {isOverride && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded self-center">Override</span>}
               </div>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={(checked) => {
                startTransition(() => toggleFeatureOverride(userId, feature.id, checked));
              }}
              disabled={isPending}
            />
          </div>
        );
      })}
    </div>
  );
}
