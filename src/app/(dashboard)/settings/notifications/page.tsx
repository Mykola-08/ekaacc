'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateNotificationPreferences } from '@/app/actions/notification-preferences-actions';

type PrefsState = {
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  booking_reminders: boolean;
  assignment_due: boolean;
  ai_insights_weekly: boolean;
};

export default function NotificationsSettingsPage() {
  const [prefs, setPrefs] = useState<PrefsState>({
    email_enabled: true,
    push_enabled: true,
    in_app_enabled: true,
    booking_reminders: true,
    assignment_due: true,
    ai_insights_weekly: true,
  });
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggle = (key: keyof PrefsState) => {
    setPrefs((current) => ({ ...current, [key]: !current[key] }));
  };

  const onSave = () => {
    setSaved(false);
    startTransition(async () => {
      const result = await updateNotificationPreferences(prefs);
      if (result.success) setSaved(true);
    });
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-[var(--radius)]">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Choose what updates you receive and how frequently.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {([
            ['email_enabled', 'Email notifications'],
            ['push_enabled', 'Push notifications'],
            ['in_app_enabled', 'In-app notifications'],
            ['booking_reminders', 'Booking reminders'],
            ['assignment_due', 'Assignment due reminders'],
            ['ai_insights_weekly', 'Weekly AI insights digest'],
          ] as Array<[keyof PrefsState, string]>).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between rounded-[var(--radius)] border border-border/60 p-3">
              <Label className="text-sm">{label}</Label>
              <Switch checked={prefs[key]} onCheckedChange={() => toggle(key)} />
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end gap-2">
          {saved && <span className="text-sm text-success">Saved</span>}
          <Button onClick={onSave} disabled={isPending} className="rounded-[calc(var(--radius)*0.8)]">
            {isPending ? 'Saving…' : 'Save preferences'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
