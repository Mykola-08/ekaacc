import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function ConsoleAuditLogPage() {
  const supabase = await createClient();
  const { data: logs, error } = await supabase
    .from('audit_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return <div className="text-destructive p-6">Error loading logs: {error.message}</div>;
  }

  return (
    <div className="mx-auto max-w-400">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Global Audit Log</h1>
        <Badge variant="outline" className="text-muted-foreground">
          Last 100 Events
        </Badge>
      </div>

      <Card>
        <CardHeader className="bg-muted/20 border-b pb-3">
          <CardTitle className="text-base">System Activity Stream</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase">
                <tr>
                  <th className="w-40 px-4 py-3 font-medium">Time</th>
                  <th className="w-32 px-4 py-3 font-medium">Actor</th>
                  <th className="w-48 px-4 py-3 font-medium">Event</th>
                  <th className="w-40 px-4 py-3 font-medium">Resource</th>
                  <th className="px-4 py-3 font-medium">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs && logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                      <td className="text-muted-foreground px-4 py-3 text-xs whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td
                        className="text-primary max-w-30 truncate px-4 py-3 font-mono text-xs"
                        title={log.actor_id}
                      >
                        {log.actor_id ? log.actor_id.slice(0, 8) + '...' : 'System'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="bg-background font-normal">
                          {log.event_type}
                        </Badge>
                      </td>
                      <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                        {log.resource_type
                          ? `${log.resource_type}:${log.resource_id?.slice(0, 6) || '?'}`
                          : '-'}
                      </td>
                      <td className="max-w-100 px-4 py-3">
                        <code className="bg-muted/60 text-muted-foreground block truncate rounded p-1.5 font-mono text-[10px]">
                          {JSON.stringify(log.metadata)}
                        </code>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-muted-foreground p-8 text-center">
                      No audit events found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
