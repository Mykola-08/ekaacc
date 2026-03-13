import React from 'react';
import PersonProfile from '@/components/platform/eka/person-profile';

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="px-4 py-8 md:px-8">
      <div className="">
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">Client Profile</h2>
        <p className="text-muted-foreground text-sm font-medium">
          Viewing details for client ID: {id}
        </p>
      </div>
      <PersonProfile userId={id} />
    </div>
  );
}
