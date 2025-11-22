import React from 'react';
import PersonProfile from '@/components/eka/person-profile';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';

export default function PersonPage({ params }: { params: { id: string } }) {
  const { id } = params;
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
