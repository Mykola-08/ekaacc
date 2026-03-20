import { getEntitlementSummary } from '@/app/actions/entitlements-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, CardAction } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar03Icon,
  Wallet01Icon,
  UserGroupIcon,
  FolderOpenIcon,
  SparklesIcon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function BenefitRow({ icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <HugeiconsIcon icon={icon} className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export default async function PlanPage() {
  const { data } = await getEntitlementSummary();

  const sessionPct =
    data.sessionsIncluded > 0
      ? Math.round((data.sessionsUsed / data.sessionsIncluded) * 100)
      : 0;
  const hasPlan = data.planStatus === 'active';

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Plan &amp; Benefits</h1>
          <p className="text-sm text-muted-foreground">Everything unlocked for your account</p>
        </div>
        {hasPlan && (
          <Badge variant="default" className="capitalize">
            {data.planStatus}
          </Badge>
        )}
      </div>

      {/* Plan card */}
      <Card>
        <CardHeader>
          <CardDescription>Current Plan</CardDescription>
          <CardTitle className="text-2xl font-bold">{data.planName}</CardTitle>
          {data.renewalDate && (
            <CardAction>
              <span className="text-xs text-muted-foreground">
                Renews {new Date(data.renewalDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </CardAction>
          )}
        </CardHeader>
        {!hasPlan && (
          <CardFooter>
            <Link href="/finances?tab=plans" className="w-full">
              <Button className="w-full gap-1.5">
                <HugeiconsIcon icon={SparklesIcon} className="size-4" />
                Upgrade Plan
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>

      {/* Sessions meter */}
      {data.sessionsIncluded > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Calendar03Icon} className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Session Credits</CardTitle>
            </div>
            <CardAction>
              <Link href="/bookings">
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  Book
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold tabular-nums">{data.sessionsRemaining}</p>
              <p className="text-sm text-muted-foreground pb-1">
                {data.sessionsUsed} of {data.sessionsIncluded} used
              </p>
            </div>
            <Progress value={sessionPct} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {data.sessionsRemaining === 0
                ? 'All sessions used — upgrade to add more'
                : `${data.sessionsRemaining} session${data.sessionsRemaining !== 1 ? 's' : ''} remaining this period`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Benefits grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <BenefitRow
          icon={Wallet01Icon}
          label="Shop discount"
          value={data.discountPercent > 0 ? `${data.discountPercent}% off` : 'No discount'}
          sub={data.discountPercent > 0 ? 'Applied at checkout automatically' : 'Upgrade to unlock discounts'}
        />
        <BenefitRow
          icon={Wallet01Icon}
          label="Savings to date"
          value={formatCurrency(data.savingsCents)}
          sub="Total saved through your plan"
        />
        <BenefitRow
          icon={UserGroupIcon}
          label="Community access"
          value={data.communityTier === 'premium' ? 'Premium' : 'Standard'}
          sub={data.communityTier === 'premium' ? 'Full community access unlocked' : 'Basic community access'}
        />
        <BenefitRow
          icon={FolderOpenIcon}
          label="Resources access"
          value={data.resourcesTier === 'premium' ? 'Full library' : 'Basic library'}
          sub={data.resourcesTier === 'premium' ? 'All resources unlocked' : 'Limited resource access'}
        />
      </div>

      {/* Upgrade CTA for free users */}
      {!hasPlan && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Unlock More with a Plan</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Get session credits, shop discounts, and premium community access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {[
                'Monthly session credits included',
                'Up to 15% off shop purchases',
                'Premium community & resource access',
                'Priority booking slots',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 shrink-0 text-primary" />
                  {benefit}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/finances?tab=plans" className="w-full">
              <Button className="w-full gap-1.5">
                View Plans
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
