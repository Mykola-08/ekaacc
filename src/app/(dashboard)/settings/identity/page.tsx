'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updateIdentitySettings } from '@/app/actions/settings-actions';

export default function IdentitySettingsPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [language, setLanguage] = useState('en');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSave = () => {
    setSaved(false);
    setError(null);

    startTransition(async () => {
      const res = await updateIdentitySettings({
        full_name: fullName || undefined,
        phone: phone || undefined,
        date_of_birth: dateOfBirth || null,
        nationality: nationality || null,
        preferred_language: language || null,
      });

      if (!res.success) {
        setError(res.error ?? 'Failed to save identity settings');
        return;
      }

      setSaved(true);
    });
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-[var(--radius)]">
        <CardHeader>
          <CardTitle>Identity Settings</CardTitle>
          <CardDescription>
            Manage your legal/profile identity details used across bookings and records.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Full legal name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Date of birth</Label>
            <Input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Nationality</Label>
            <Input value={nationality} onChange={(e) => setNationality(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Preferred language</Label>
            <Input value={language} onChange={(e) => setLanguage(e.target.value)} />
          </div>

          {error && (
            <Alert variant="destructive" className="md:col-span-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {saved && (
            <Alert className="md:col-span-2">
              <AlertDescription>Identity settings updated successfully.</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            onClick={onSave}
            disabled={isPending}
            className="rounded-[calc(var(--radius)*0.8)]"
          >
            {isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
