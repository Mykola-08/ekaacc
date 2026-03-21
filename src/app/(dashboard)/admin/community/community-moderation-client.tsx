'use client';

import { useMemo, useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateCommunityReportStatus } from '@/app/actions/community-actions';

type Report = {
  id: string;
  reason: string;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  details: string | null;
  created_at: string;
  post: { id: string; title: string | null; content: string | null } | null;
};

const FILTERS: Array<Report['status'] | 'all'> = [
  'all',
  'open',
  'reviewing',
  'resolved',
  'dismissed',
];

export function CommunityModerationClient({ initialReports }: { initialReports: Report[] }) {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('all');
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return reports;
    return reports.filter((report) => report.status === activeFilter);
  }, [activeFilter, reports]);

  const updateStatus = (id: string, status: Report['status']) => {
    startTransition(async () => {
      const res = await updateCommunityReportStatus({ report_id: id, status });
      if (!res.success) return;
      setReports((current) => current.map((r) => (r.id === id ? { ...r, status } : r)));
    });
  };

  return (
    <Card className="rounded-[var(--radius)]">
      <CardHeader>
        <CardTitle>Community Moderation Queue</CardTitle>
        <CardDescription>Review reported content and apply moderation actions.</CardDescription>
        <div className="flex flex-wrap gap-2 pt-2">
          {FILTERS.map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant={activeFilter === filter ? 'default' : 'outline'}
              onClick={() => setActiveFilter(filter)}
              className="rounded-full capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">No reports for this filter.</p>
        ) : (
          filtered.map((report) => (
            <div key={report.id} className="border-border/60 rounded-[var(--radius)] border p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold capitalize">{report.reason}</p>
                <Badge variant="outline" className="capitalize">
                  {report.status}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {report.post?.title ?? 'Reported Post'}
              </p>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                {report.post?.content ?? ''}
              </p>
              {report.details && (
                <p className="bg-muted text-foreground mt-2 rounded-[calc(var(--radius)*0.8)] p-2 text-xs">
                  Reporter note: {report.details}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-[calc(var(--radius)*0.8)]"
                  disabled={isPending}
                  onClick={() => updateStatus(report.id, 'reviewing')}
                >
                  Mark Reviewing
                </Button>
                <Button
                  size="sm"
                  className="rounded-[calc(var(--radius)*0.8)]"
                  disabled={isPending}
                  onClick={() => updateStatus(report.id, 'resolved')}
                >
                  Resolve
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-[calc(var(--radius)*0.8)]"
                  disabled={isPending}
                  onClick={() => updateStatus(report.id, 'dismissed')}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
