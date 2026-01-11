import { getErrorLogs } from "@/server/logging/actions";
import { format } from "date-fns";
import { ErrorLogDialog } from "@/components/admin/error-log-dialog";

// Simple container for the page
export default async function ErrorLogsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  
  // Wrap in try-catch to render unauthorized message gracefully in UI if needed, 
  // though Layout will handle most. 
  
  let logs: any[] = [];
  let count: number | null = 0;
  let errorStr = '';

  try {
      const result = await getErrorLogs(page);
      logs = result.data || [];
      count = result.count;
  } catch (e: any) {
      errorStr = e.message;
  }

  if (errorStr) {
      return (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              Error loading logs: {errorStr}
          </div>
      )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">System Error Logs</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded">
             Total Events: <span className="font-semibold text-foreground">{count}</span>
        </div>
      </div>

      <div className="border rounded-xl shadow-sm bg-card overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground border-b font-medium">
                    <tr>
                        <th className="p-4 w-[180px]">Timestamp</th>
                        <th className="p-4 max-w-[400px]">Message</th>
                        <th className="p-4">Context URL</th>
                        <th className="p-4">User</th>
                        <th className="p-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {logs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-muted/5 transition-colors group">
                            <td className="p-4 whitespace-nowrap text-muted-foreground font-mono text-xs">
                                {format(new Date(log.created_at), 'MMM dd, HH:mm:ss')}
                            </td>
                            <td className="p-4">
                                <div className="font-medium text-foreground max-w-[300px] truncate" title={log.error_message}>
                                    {log.error_message}
                                </div>
                                <div className="text-xs text-muted-foreground truncate mt-0.5">
                                    {log.user_agent}
                                </div>
                            </td>
                            <td className="p-4 max-w-[200px]">
                                <div className="truncate text-xs text-muted-foreground bg-muted inline-block px-1.5 py-0.5 rounded">
                                    {log.url?.replace(/^https?:\/\/[^/]+/, '') || '/'}
                                </div>
                            </td>
                            <td className="p-4 text-xs font-mono">
                                {log.user_id ? (
                                    <span className="text-primary">{log.user_id.slice(0, 8)}</span>
                                ) : (
                                    <span className="text-muted-foreground opacity-50">Guest</span>
                                )}
                            </td>
                            <td className="p-4 text-right">
                                <ErrorLogDialog log={log} />
                            </td>
                        </tr>
                    ))}
                    {logs.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                         ✅
                                    </div>
                                    <p>No errors found in the logs.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
         </div>
      </div>
      
      {/* Pagination Controls Placeholder */}
      <div className="flex justify-center gap-2">
          {page > 1 && (
              <a href={`?page=${page - 1}`} className="px-4 py-2 border rounded-md text-sm hover:bg-muted">Previous</a>
          )}
          {((count || 0) > page * 20) && (
               <a href={`?page=${page + 1}`} className="px-4 py-2 border rounded-md text-sm hover:bg-muted">Next</a>
          )}
      </div>
    </div>
  )
}
