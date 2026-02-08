import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CrisisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <DashboardHeader
        title="Crisis Support"
        subtitle="If you are in immediate danger, call local emergency services now."
      />

      <Card className="border-destructive/30 bg-destructive/5 rounded-[24px] border shadow-sm">
        <CardContent className="space-y-6 p-8">
          <p className="text-foreground text-base">
            This space is for urgent support guidance. If this is an emergency, use emergency
            services in your area first.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-border bg-card rounded-2xl border p-5">
              <h3 className="text-lg font-bold">Emergency</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Call your local emergency number immediately.
              </p>
            </div>
            <div className="border-border bg-card rounded-2xl border p-5">
              <h3 className="text-lg font-bold">Need Follow-up Care</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Contact your therapist and review your safety plan.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/bookings">View Upcoming Sessions</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/resources">Open Materials</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
