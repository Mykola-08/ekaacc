'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ErrorLogDialog({ log }: { log: any }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Error Details</DialogTitle>
          <DialogDescription>
             Log ID: <span className="font-mono text-xs">{log.id}</span>
             <br/>
             Timestamp: {new Date(log.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
            <div>
                <h4 className="text-sm font-semibold mb-2">Error Message</h4>
                <div className="bg-destructive/10 text-destructive border-destructive/20 border p-3 rounded-md font-mono text-xs break-all">
                    {log.error_message}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                     <h4 className="text-sm font-semibold">Context Info</h4>
                     <div className="bg-muted p-3 rounded-md text-xs space-y-2">
                        <div className="flex flex-col">
                            <span className="text-muted-foreground uppercase text-[10px] tracking-wider">URL</span>
                            <span className="break-all">{log.url}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground uppercase text-[10px] tracking-wider">User ID</span>
                            <span className="font-mono">{log.user_id || 'Anonymous'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground uppercase text-[10px] tracking-wider">App Version</span>
                            <span>{log.app_version || 'Unknown'}</span>
                        </div>
                         <div className="flex flex-col">
                            <span className="text-muted-foreground uppercase text-[10px] tracking-wider">User Agent</span>
                            <span className="truncate" title={log.user_agent}>{log.user_agent}</span>
                        </div>
                     </div>
                </div>
                <div className="space-y-2">
                     <h4 className="text-sm font-semibold">Metadata</h4>
                     <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto h-full max-h-[200px]">
                         {JSON.stringify(log.metadata, null, 2)}
                     </pre>
                </div>
            </div>

            {log.stack_trace && (
              <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Stack Trace</h4>
                   <pre className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-[10px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[300px]">
                       {log.stack_trace}
                   </pre>
              </div>
            )}
            
            {log.component_stack && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Component Stack</h4>
                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-[10px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[300px]">
                        {log.component_stack}
                    </pre>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
