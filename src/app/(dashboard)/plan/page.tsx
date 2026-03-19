import { getEntitlementSummary } from '@/app/actions/entitlements-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export default async function PlanPage() {
  const { data } = await getEntitlementSummary();

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Plan & Benefits</CardTitle>
              <CardDescription>Everything currently unlocked for your account.</CardDescription>
            </div>
            <Badge className="capitalize" variant="secondary">
              {data.planStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Plan</p>
            <p className="text-lg font-semibold">{data.planName}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Sessions remaining</p>
            <p className="text-lg font-semibold">{data.sessionsRemaining}</p>
            <p className="text-xs text-muted-foreground">
              {data.sessionsUsed}/{data.sessionsIncluded} used
            </p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Savings to date</p>
            <p className="text-lg font-semibold">{formatCurrency(data.savingsCents)}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Shop discount</p>
            <p className="text-lg font-semibold">{data.discountPercent}%</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Community access</p>
            <p className="text-lg font-semibold capitalize">{data.communityTier}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Resources access</p>
            <p className="text-lg font-semibold capitalize">{data.resourcesTier}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
