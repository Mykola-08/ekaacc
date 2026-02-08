'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import {
  FEATURE_AREAS,
  FEATURE_CATALOG,
  type FeatureAudience,
} from '@/shared/features/feature-catalog';

const AUDIENCE_FILTERS: Array<FeatureAudience | 'All'> = [
  'All',
  'Everyone',
  'Client',
  'Therapist',
  'Admin',
];

export function FeatureDirectory() {
  const [query, setQuery] = useState('');
  const [audience, setAudience] = useState<FeatureAudience | 'All'>('All');

  const filtered = useMemo(() => {
    return FEATURE_CATALOG.filter((feature) => {
      const matchesAudience =
        audience === 'All' || feature.audience === audience || feature.audience === 'Everyone';
      const text =
        `${feature.title} ${feature.description} ${feature.area} ${feature.audience}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      return matchesAudience && matchesQuery;
    });
  }, [query, audience]);

  const grouped = useMemo(() => {
    return FEATURE_AREAS.map((area) => ({
      area,
      items: filtered.filter((feature) => feature.area === area),
    })).filter((group) => group.items.length > 0);
  }, [filtered]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      <DashboardHeader
        title="Feature Directory"
        subtitle="Every major website feature in one organized place."
      />

      <Card className="border-border/60 rounded-[28px] border shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search features, pages, and tools..."
            className="h-12 md:max-w-xl"
          />
          <div className="flex flex-wrap gap-2">
            {AUDIENCE_FILTERS.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={audience === item ? 'default' : 'outline'}
                onClick={() => setAudience(item)}
                className="rounded-full"
              >
                {item}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {grouped.map((group) => (
          <section key={group.area} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">{group.area}</h3>
              <Badge variant="secondary" className="rounded-full">
                {group.items.length} features
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {group.items.map((feature) => (
                <Card
                  key={feature.id}
                  className="border-border/60 hover:border-primary/40 rounded-2xl border transition-colors"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full">
                          {feature.audience}
                        </Badge>
                        {feature.status === 'beta' && <Badge className="rounded-full">Beta</Badge>}
                      </div>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button asChild variant="outline" className="w-full rounded-xl">
                      <Link href={feature.href}>Open {feature.title}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
