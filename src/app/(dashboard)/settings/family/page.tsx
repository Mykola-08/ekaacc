import { getFamilyMembers } from '@/server/family/actions';
import { FamilyList } from '@/components/settings/family-list';
import { AddFamilyDialog } from '@/components/settings/add-family-dialog';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function FamilySettingsPage() {
  const members = await getFamilyMembers();

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="">
        <Link
          href="/settings"
          className="text-muted-foreground hover:text-foreground group flex w-fit items-center gap-1 text-sm transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Settings
        </Link>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="">
            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
              Family &amp; Dependents
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
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
