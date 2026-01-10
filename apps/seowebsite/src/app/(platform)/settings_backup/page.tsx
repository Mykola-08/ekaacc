import { SettingsShell } from "@/components/platform/eka/settings/settings-shell"
import { SettingsHeader } from "@/components/platform/eka/settings/settings-header"
import { AccountSettings } from "@/components/platform/eka/settings/account-settings"

export default function SettingsPage() {
  return (
    <SettingsShell>
      <SettingsHeader 
        title="Account Settings" 
        description="Manage your account profile and security settings."
      />
      <AccountSettings />
    </SettingsShell>
  )
}
