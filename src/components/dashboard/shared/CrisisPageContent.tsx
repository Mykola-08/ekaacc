'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function CrisisPageContent() {
  const { t } = useLanguage();

  return (
    <div
      className="mx-auto max-w-4xl px-4 py-8 md:px-8"
    >
      <Card className="border-destructive/30 bg-destructive/5 rounded-xl border">
        <CardContent className="p-8">
          <p className="text-foreground text-base">
            {t('page.crisis.description') ||
              'This space is for urgent support guidance. If this is an emergency, use emergency services in your area first.'}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-border bg-card rounded-lg border p-5">
              <h3 className="text-lg font-semibold">{t('page.crisis.emergency') || 'Emergency'}</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {t('page.crisis.emergencyDesc') || 'Call your local emergency number immediately.'}
              </p>
            </div>
            <div className="border-border bg-card rounded-lg border p-5">
              <h3 className="text-lg font-semibold">
                {t('page.crisis.followUp') || 'Need Follow-up Care'}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {t('page.crisis.followUpDesc') ||
                  'Contact your therapist and review your safety plan.'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/bookings">
                {t('page.crisis.viewSessions') || 'View Upcoming Sessions'}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/resources">{t('page.crisis.openMaterials') || 'Open Materials'}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
