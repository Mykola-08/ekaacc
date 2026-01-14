"use client";

import { format } from "date-fns";
import { ErrorLogDialog } from "@/components/admin/error-log-dialog";
import { AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ErrorLogsHeadlessProps {
    logs: any[];
    count: number;
    page: number;
}

export function ErrorLogsHeadless({ logs, count, page }: ErrorLogsHeadlessProps) {
    return (
        <div className="w-full bg-background min-h-screen p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif text-foreground">System Error Logs</h1>
                        <p className="text-muted-foreground mt-1">Monitor application health and issues.</p>
                    </div>
                    <div className="bg-card border border-border/60 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground shadow-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>Total Events:</span>
                        <span className="text-foreground font-bold">{count}</span>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card rounded-[32px] border border-border/60 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 bg-muted/40/50">
                                    <th className="p-6 font-semibold text-muted-foreground w-[180px]">Timestamp</th>
                                    <th className="p-6 font-semibold text-muted-foreground max-w-[400px]">Message</th>
                                    <th className="p-6 font-semibold text-muted-foreground">Context URL</th>
                                    <th className="p-6 font-semibold text-muted-foreground">User</th>
                                    <th className="p-6 font-semibold text-muted-foreground text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center">
                                             <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="w-6 h-6 text-green-500" />
                                             </div>
                                             <p className="text-muted-foreground font-medium">No errors found in the logs.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-muted/40/50 transition-colors group">
                                            <td className="p-6 whitespace-nowrap text-muted-foreground font-mono text-xs">
                                                {format(new Date(log.created_at), 'MMM dd, HH:mm:ss')}
                                            </td>
                                            <td className="p-6">
                                                <div className="font-bold text-foreground max-w-75 truncate" title={log.error_message}>
                                                    {log.error_message}
                                                </div>
                                                <div className="text-xs text-muted-foreground/80 truncate mt-1 font-mono">
                                                    {log.user_agent}
                                                </div>
                                            </td>
                                            <td className="p-6 max-w-50">
                                                <div className="truncate text-xs text-muted-foreground bg-muted inline-block px-2 py-1 rounded-md font-medium">
                                                    {log.url?.replace(/^https?:\/\/[^/]+/, '') || '/'}
                                                </div>
                                            </td>
                                            <td className="p-6 text-xs font-mono">
                                                {log.user_id ? (
                                                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-bold">
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
                            className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border/60 rounded-full text-muted-foreground font-medium hover:bg-muted/40 shadow-sm transition-all hover:shadow-md"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Link>
                    )}
                    {((count || 0) > page * 20) && (
                        <Link 
                            href={`?page=${page + 1}`} 
                            className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border/60 rounded-full text-muted-foreground font-medium hover:bg-muted/40 shadow-sm transition-all hover:shadow-md"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
