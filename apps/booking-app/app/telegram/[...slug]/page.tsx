'use client';

import { use } from 'react';

export default function TelegramActionPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = use(params);
  const title = slug.join(' ');

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold capitalize">{title}</h1>
      <p className="mt-4">This feature is under construction.</p>
    </div>
  );
}
