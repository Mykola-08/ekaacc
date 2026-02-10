'use client';

import { format } from 'date-fns';
import { ErrorLogDialog } from '@/components/admin/error-log-dialog';
import { AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ErrorLogsHeadlessProps {
  logs: any[];
  count: number;
  page: number;
}

export function ErrorLogsHeadless({ logs, count, page }: ErrorLogsHeadlessProps) {
  return (
    <div className="bg-background min-h-screen w-full p-6 md:p-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-foreground font-serif text-3xl">System Error Logs</h1>
            <p className="text-muted-foreground mt-1">Monitor application health and issues.</p>
          </div>
          <div className="bg-card border-border/60 text-muted-foreground flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium shadow-sm">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Total Events:</span>
            <span className="text-foreground font-semibold">{count}</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border-border/60 overflow-hidden rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-muted/40/50 border-b border-slate-50">
                  <th className="text-muted-foreground w-[180px] p-6 font-semibold">Timestamp</th>
                  <th className="text-muted-foreground max-w-[400px] p-6 font-semibold">Message</th>
                  <th className="text-muted-foreground p-6 font-semibold">Context URL</th>
                  <th className="text-muted-foreground p-6 font-semibold">User</th>
                  <th className="text-muted-foreground p-6 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="text-muted-foreground font-medium">
                        No errors found in the logs.
                      </p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/40/50 group transition-colors">
                      <td className="text-muted-foreground p-6 font-mono text-xs whitespace-nowrap">
                        {format(new Date(log.created_at), 'MMM dd, HH:mm:ss')}
                      </td>
                      <td className="p-6">
                        <div
                          className="text-foreground max-w-75 truncate font-semibold"
                          title={log.error_message}
                        >
                          {log.error_message}
                        </div>
                        <div className="text-muted-foreground/80 mt-1 truncate font-mono text-xs">
                          {log.user_agent}
                        </div>
                      </td>
                      <td className="max-w-50 p-6">
                        <div className="text-muted-foreground bg-muted inline-block truncate rounded-md px-2 py-1 text-xs font-medium">
                          {log.url?.replace(/^https?:\/\/[^/]+/, '') || '/'}
                        </div>
                      </td>
                      <td className="p-6 font-mono text-xs">
                        {log.user_id ? (
                          <span className="rounded-md bg-indigo-50 px-2 py-1 font-semibold text-indigo-700">
                            {log.user_id.slice(0, 8)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/80 italic">Guest</span>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <ErrorLogDialog log={log} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-3">
          {page > 1 && (
            <Link
              href={`?page=${page - 1}`}
              className="bg-card border-border/60 text-muted-foreground hover:bg-muted/40 flex items-center gap-2 rounded-full border px-5 py-2.5 font-medium shadow-sm transition-all hover:shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
          )}
          {(count || 0) > page * 20 && (
            <Link
              href={`?page=${page + 1}`}
              className="bg-card border-border/60 text-muted-foreground hover:bg-muted/40 flex items-center gap-2 rounded-full border px-5 py-2.5 font-medium shadow-sm transition-all hover:shadow-md"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
