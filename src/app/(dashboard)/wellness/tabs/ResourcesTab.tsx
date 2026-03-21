'use client';

import { useState, useEffect } from 'react';
import { ResourcesPage } from '@/components/resources/ResourcesPage';
import { Button } from '@/components/ui/button';

export function ResourcesTab() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/resources');
      if (res.ok) {
        const data = await res.json();
        setResources(data.resources || data || []);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted h-24 animate-pulse rounded-[var(--radius)]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius)] border border-dashed py-16 text-center">
        <p className="text-foreground text-sm font-medium">Failed to load resources</p>
        <p className="text-muted-foreground text-xs">Check your connection and try again.</p>
        <Button variant="outline" size="sm" onClick={fetchResources}>
          Try Again
        </Button>
      </div>
    );
  }

  return <ResourcesPage initialResources={resources} />;
}
