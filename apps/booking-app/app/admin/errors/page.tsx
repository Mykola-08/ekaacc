import { getErrorLogs } from "@/server/logging/actions";
import { ErrorLogsHeadless } from "@/components/admin/errors/error-logs-headless";

export default async function ErrorLogsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
 const params = await searchParams;
 const page = Number(params?.page) || 1;
 
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
     <div className="w-full bg-[#FDFBF9] min-h-screen p-6 md:p-12 flex items-center justify-center">
        <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 max-w-md text-center">
            <h3 className="font-bold mb-2">Error loading logs</h3>
            <p className="text-sm opacity-80">{errorStr}</p>
        </div>
     </div>
   )
 }

 return <ErrorLogsHeadless logs={logs} count={count || 0} page={page} />;
}
