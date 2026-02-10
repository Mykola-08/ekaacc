import { getFamilyMembers } from '@/server/family/actions';
import { FamilyList } from '@/components/settings/family-list';
import { AddFamilyDialog } from '@/components/settings/add-family-dialog';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function FamilySettingsPage() {
  const members = await getFamilyMembers();

  return (
    <div className="space-y-8 px-4 py-8 md:px-8">
      <div className="space-y-4">
        <Link
          href="/settings"
          className="text-muted-foreground hover:text-foreground group flex w-fit items-center gap-1 text-sm transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Settings
        </Link>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Family &amp; Dependents
            </h2>
            <p className="text-sm font-medium text-muted-foreground">
              Manage profiles for your children or others you book for.
            </p>
          </div>
          <AddFamilyDialog />
        </div>
      </div>
      <FamilyList members={members} />
    </div>
  );
}
