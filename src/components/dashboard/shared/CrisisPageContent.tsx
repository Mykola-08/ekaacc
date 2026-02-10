'use client';

import { motion } from 'motion/react';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function CrisisPageContent() {
  const { t } = useLanguage();

  return (
    <motion.div
      className="mx-auto max-w-4xl space-y-8 px-4 py-8 md:px-8"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      <DashboardHeader
        title={t('page.crisis.title') || 'Crisis Support'}
        subtitle={
          t('page.crisis.subtitle') ||
          'If you are in immediate danger, call local emergency services now.'
        }
      />

      <Card className="rounded-lg border border-destructive/30 bg-destructive/5">
        <CardContent className="space-y-6 p-8">
          <p className="text-base text-foreground">
            {t('page.crisis.description') ||
              'This space is for urgent support guidance. If this is an emergency, use emergency services in your area first.'}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-lg font-semibold">
                {t('page.crisis.emergency') || 'Emergency'}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('page.crisis.emergencyDesc') ||
                  'Call your local emergency number immediately.'}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-lg font-semibold">
                {t('page.crisis.followUp') || 'Need Follow-up Care'}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
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
              <Link href="/resources">
                {t('page.crisis.openMaterials') || 'Open Materials'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
