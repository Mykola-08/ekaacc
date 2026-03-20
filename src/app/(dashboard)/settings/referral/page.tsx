'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getReferralOverview } from '@/app/actions/settings-actions';

type ReferralOverview = {
  code: string | null;
  count: number;
  error: string | null;
};

export default function ReferralSettingsPage() {
  const [overview, setOverview] = useState<ReferralOverview>({ code: null, count: 0, error: null });

  useEffect(() => {
    getReferralOverview().then((res) => {
      setOverview(res as ReferralOverview);
    });
  }, []);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const link = overview.code ? `${origin}/signup?ref=${overview.code}` : '';

  const onCopy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
  };

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <Card className="rounded-[var(--radius)]">
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
          <CardDescription>
            Share your referral link and track successful invites.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-[var(--radius)] border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">Your referral code</p>
            <p className="mt-1 text-2xl font-semibold tracking-wide">{overview.code ?? '—'}</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">Referral link</p>
            <div className="flex items-center gap-2">
              <Input value={link} readOnly />
              <Button variant="outline" onClick={onCopy}>Copy</Button>
            </div>
          </div>

          <div className="rounded-[var(--radius)] border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">Successful referrals</p>
            <p className="mt-1 text-2xl font-semibold">{overview.count}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
