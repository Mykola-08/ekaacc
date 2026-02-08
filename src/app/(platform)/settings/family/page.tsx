import { getFamilyMembers } from '@/server/family/actions'
import { FamilyList } from '@/components/settings/family-list'
import { AddFamilyDialog } from '@/components/settings/add-family-dialog'
import { Separator } from "@/components/ui/separator"
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function FamilySettingsPage() {
 const members = await getFamilyMembers()

 return (
  <div className="min-h-screen bg-background pb-24">
    {/* Header */}
    <div className="bg-card border-b border-border/60 pt-32 pb-12 mb-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">
             <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors w-fit group">
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Settings
             </Link>
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                   <h1 className="font-serif text-4xl text-foreground mb-2">Family & Dependents</h1>
                   <p className="text-muted-foreground text-lg">Manage profiles for your children or others you book for.</p>
                </div>
                <AddFamilyDialog />
             </div>
        </div>
    </div>

    <div className="container mx-auto px-4 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <FamilyList members={members} />
    </div>
  </div>
 )
}

