import { getFamilyMembers } from '@/server/family/actions';
import { FamilyList } from '@/components/settings/family-list';
import { AddFamilyDialog } from '@/components/settings/add-family-dialog';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function FamilySettingsPage() {
  const members = await getFamilyMembers();

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Header */}
      <div className="bg-card border-border/60 mb-12 border-b pt-32 pb-12">
        <div className="container mx-auto max-w-4xl space-y-4 px-4">
          <Link
            href="/settings"
            className="text-muted-foreground hover:text-foreground group flex w-fit items-center gap-1 text-sm transition-colors"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Settings
          </Link>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-foreground mb-2 font-serif text-4xl">Family & Dependents</h1>
              <p className="text-muted-foreground text-lg">
                Manage profiles for your children or others you book for.
              </p>
            </div>
            <AddFamilyDialog />
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto max-w-4xl px-4 duration-700">
        <FamilyList members={members} />
      </div>
    </div>
  );
}
