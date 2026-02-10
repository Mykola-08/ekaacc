import React from 'react';
import PersonProfile from '@/components/platform/eka/person-profile';

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 px-4 py-8 duration-700 md:px-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Client Profile</h2>
        <p className="text-sm font-medium text-muted-foreground">
          Viewing details for client ID: {id}
        </p>
      </div>
      <PersonProfile userId={id} />
    </div>
  );
}
