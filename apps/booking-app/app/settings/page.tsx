import { getUserSettings } from '@/server/settings/actions'
import { SettingsForm } from '@/components/settings/settings-form'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const profile = await getUserSettings()

  if (!profile) {
      redirect('/login')
  }

  return (
    <div className="container max-w-4xl py-6 md:py-10 space-y-8 min-h-screen">
       <div className="animate-fade-in">
         <h1 className="text-3xl font-serif text-foreground">Settings</h1>
         <p className="text-muted-foreground">Manage your account and preferences.</p>
       </div>
       
       <div className="grid gap-8">
            <div className="animate-slide-up">
               <SettingsForm profile={profile} />
            </div>
            
            {/* Placeholder for Notifications or other settings */}
            <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-medium mb-2">Notifications</h3>
                <p className="text-sm text-muted-foreground">Notification preferences coming soon.</p>
            </div>
       </div>
    </div>
  )
}
