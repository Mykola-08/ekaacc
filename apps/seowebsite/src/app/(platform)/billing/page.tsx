
import { BillingSettings } from '@/components/platform/settings/billing-settings';
import { SettingsShell } from "@/components/platform/eka/settings/settings-shell"
import { SettingsHeader } from "@/components/platform/eka/settings/settings-header"

export default function BillingPage() {
  return (
    <SettingsShell>
      <SettingsHeader 
        title="Billing & Subscription" 
        description="Manage your subscription plan and billing information."
      />
      <BillingSettings />
    </SettingsShell>
  );
}
