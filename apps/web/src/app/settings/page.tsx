import { SettingsShell } from "@/components/eka/settings/settings-shell"
import { SettingsHeader } from "@/components/eka/settings/settings-header"
import { AccountSettings } from "@/components/eka/settings/account-settings"

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
