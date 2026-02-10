'use client';

import { useState, useEffect } from 'react';
import { ResourcesPage } from '@/components/resources/ResourcesPage';

export function ResourcesTab() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await fetch('/api/resources');
        if (res.ok) {
          const data = await res.json();
          setResources(data.resources || data || []);
        }
      } catch (e) {
        console.error('Failed to load resources:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return <ResourcesPage initialResources={resources} />;
}
