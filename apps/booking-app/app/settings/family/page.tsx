import { getFamilyMembers } from '@/server/family/actions'
import { FamilyList } from '@/components/settings/family-list'
import { AddFamilyDialog } from '@/components/settings/add-family-dialog'
import { Separator } from "@/components/ui/separator"
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function FamilySettingsPage() {
  const members = await getFamilyMembers()

  return (
    <div className="container max-w-4xl py-10 space-y-6 animate-in fade-in duration-500">
        <div className="pb-4">
             <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors mb-4 w-fit">
                <ChevronLeft className="h-4 w-4" />
                Back to Settings
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-primary">Family & Dependents</h1>
                    <p className="text-muted-foreground mt-1">Manage profiles for your children or others you book for.</p>
                </div>
                <AddFamilyDialog />
            </div>
        </div>
        <Separator className="bg-border-subtle" />
        <FamilyList members={members} />
    </div>
  )
}
