import React from 'react';
import PersonProfile from '@/components/platform/eka/person-profile';
import { SettingsShell } from '@/components/platform/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/platform/eka/settings/settings-header';

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
 const { id } = await params;
 return (
  <SettingsShell>
   <SettingsHeader
    title="Client Profile"
    description={`Viewing details for client ID: ${id}`}
   />
   <PersonProfile userId={id} />
  </SettingsShell>
 );
}
