import React from 'react';
import PersonProfile from '@/components/eka/person-profile';

export default function PersonPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Person Profile</h1>
      <PersonProfile userId={id} />
    </div>
  );
}
