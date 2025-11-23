
import { BillingSettings } from '@/components/settings/billing-settings';

export default function BillingPage() {
  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription plan and billing information.
        </p>
      </div>
      <BillingSettings />
    </div>
  );
}
