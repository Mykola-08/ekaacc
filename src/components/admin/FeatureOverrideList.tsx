'use client';

import { toggleFeatureOverride } from '@/app/actions/admin';
import { Switch } from '@/components/ui/switch';
import { useTransition } from 'react';
import { morphToast } from '@/components/ui/morphing-toaster';

export function FeatureOverrideList({ userId, enrollments, allFeatures }: any) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (featureId: string, checked: boolean) => {
    startTransition(async () => {
      try {
        await toggleFeatureOverride(userId, featureId, checked);
        morphToast.success(checked ? 'Override Enabled' : 'Override Disabled');
      } catch (e) {
        morphToast.error('Failed to update override');
      }
    });
  };

  return (
    <div className="">
      {allFeatures.map((feature: any) => {
        const enrollment = enrollments.find((e: any) => e.feature_id === feature.id);
        const isEnabled = enrollment ? enrollment.enabled : feature.default_enabled;
        const isOverride = !!enrollment;

        return (
          <div
            key={feature.id}
            className="bg-card flex items-center justify-between rounded-xl border p-3"
          >
            <div className="flex flex-col">
              <span className="font-mono text-sm font-medium">{feature.key}</span>
              <div className="text-muted-foreground flex gap-2 text-xs">
                {feature.description}
                {isOverride && (
                  <span className="self-center rounded bg-muted px-1 text-[10px] text-muted-foreground">
                    Override
                  </span>
                )}
              </div>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={(checked) => handleToggle(feature.id, checked)}
              disabled={isPending}
            />
          </div>
        );
      })}
    </div>
  );
}
