import { getUserSettings } from '@/server/settings/actions'
import { SettingsForm } from '@/components/settings/settings-form'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const profile = await getUserSettings()

  if (!profile) {
      redirect('/login')
  }

  return (
    <div className="container max-w-4xl py-10 space-y-8">
       <div>
         <h1 className="text-3xl font-serif text-primary">Settings</h1>
         <p className="text-muted-foreground">Manage your account and preferences.</p>
       </div>
       
       <div className="grid gap-8">
            <SettingsForm profile={profile} />
            
            {/* Placeholder for Notifications or other settings */}
            <div className="p-6 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium mb-2">Notifications</h3>
                <p className="text-sm text-muted-foreground">Notification preferences coming soon.</p>
            </div>
       </div>
    </div>
  )
}
