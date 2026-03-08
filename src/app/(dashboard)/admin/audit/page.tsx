import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function GlobalAuditLogPage() {
  const supabase = await createClient();
  const { data: logs, error } = await supabase
    .from('audit_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return <div className="p-6 text-destructive">Error loading logs: {error.message}</div>;
  }

  return (
    <div className="space-y-6 p-6 max-w-400 mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Global Audit Log</h1>
        <Badge variant="outline" className="text-muted-foreground">Last 100 Events</Badge>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-base">System Activity Stream</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium w-40">Time</th>
                  <th className="px-4 py-3 font-medium w-32">Actor</th>
                  <th className="px-4 py-3 font-medium w-48">Event</th>
                  <th className="px-4 py-3 font-medium w-40">Resource</th>
                  <th className="px-4 py-3 font-medium">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs && logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-primary truncate max-w-30" title={log.actor_id}>
                        {log.actor_id ? log.actor_id.slice(0, 8) + '...' : 'System'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="font-normal bg-background">{log.event_type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                        {log.resource_type ? `${log.resource_type}:${log.resource_id?.slice(0, 6) || '?'}` : '-'}
                      </td>
                      <td className="px-4 py-3 max-w-100">
                        <code className="text-[10px] bg-muted/60 p-1.5 rounded block truncate font-mono text-muted-foreground">
                          {JSON.stringify(log.metadata)}
                        </code>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
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
