
import { BillingSettings } from '@/components/settings/billing-settings';
import { SettingsShell } from "@/components/eka/settings/settings-shell"
import { SettingsHeader } from "@/components/eka/settings/settings-header"

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
