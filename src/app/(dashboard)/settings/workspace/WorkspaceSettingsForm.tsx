'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { updateTenantFeatures } from '@/server/therapist/workspace-actions';

interface WorkspaceSettingsFormProps {
  initialFeatures: Record<string, boolean>;
}

export default function WorkspaceSettingsForm({ initialFeatures }: WorkspaceSettingsFormProps) {
  const [features, setFeatures] = useState(initialFeatures);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (key: string, checked: boolean) => {
    setFeatures((prev) => ({ ...prev, [key]: checked }));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateTenantFeatures(features);
        // Maybe trigger a toast notification here
      } catch {
        /* error handled silently */
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Modules</CardTitle>
        <CardDescription>
          Enable or disable specific features across your clinic's workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label className="text-base">Kinesiology Testing Panel</Label>
            <p className="text-muted-foreground text-sm">
              Enable the structural, chemical, and emotional testing modules in Session Mode.
            </p>
          </div>
          <Switch
            checked={features.enable_kinesiology_module || false}
            onCheckedChange={(c) => handleToggle('enable_kinesiology_module', c)}
            disabled={isPending}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label className="text-base">Patient Community</Label>
            <p className="text-muted-foreground text-sm">
              Enable an isolated community feed for your patients to interact.
            </p>
          </div>
          <Switch
            checked={features.enable_community || false}
            onCheckedChange={(c) => handleToggle('enable_community', c)}
            disabled={isPending}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label className="text-base">Custom Supplements Library</Label>
            <p className="text-muted-foreground text-sm">
              Allow prescribing custom supplements in session plans.
            </p>
          </div>
          <Switch
            checked={features.enable_supplements || false}
            onCheckedChange={(c) => handleToggle('enable_supplements', c)}
            disabled={isPending}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label className="text-base">Custom Anamnesis</Label>
            <p className="text-muted-foreground text-sm">Enable building custom intake forms.</p>
          </div>
          <Switch
            checked={features.enable_custom_anamnesis || false}
            onCheckedChange={(c) => handleToggle('enable_custom_anamnesis', c)}
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardFooter>
    </Card>
  );
}
