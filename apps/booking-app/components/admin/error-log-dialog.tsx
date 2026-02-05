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
import { AlertTriangle, Code, Terminal, Info, X } from "lucide-react"

export function ErrorLogDialog({ log }: { log: any }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs rounded-full px-4 border-border text-muted-foreground hover:text-foreground hover:border-input">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden bg-card border-none shadow-2xl rounded-4xl">
        <div className="flex flex-col h-full bg-muted/30">
            <DialogHeader className="p-8 pb-6 bg-card border-b border-border/60">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                    <DialogTitle className="text-2xl font-serif text-foreground">Error Details</DialogTitle>
                    <DialogDescription className="text-muted-foreground flex items-center gap-2 text-sm">
                        <span className="font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">ID: {log.id}</span>
                        <span>•</span>
                        <span>{new Date(log.created_at).toLocaleString()}</span>
                    </DialogDescription>
                </div>
            </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Error Message */}
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border/60">
                    <div className="flex items-center gap-3 mb-4 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        <h4 className="font-semibold">Error Message</h4>
                    </div>
                    <div className="font-mono text-sm text-foreground/90 break-all bg-red-50/50 p-4 rounded-xl border border-red-100">
                        {log.error_message}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Context Info */}
                    <div className="bg-card rounded-xl p-6 shadow-sm border border-border/60">
                        <div className="flex items-center gap-3 mb-4 text-foreground">
                            <Info className="w-5 h-5 text-muted-foreground/80" />
                            <h4 className="font-semibold">Context Info</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground/80 font-medium">URL</span>
                                <div className="text-sm text-foreground/90 break-all">{log.url}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground/80 font-medium">User ID</span>
                                <div className="text-sm text-foreground/90 font-mono bg-muted/40 px-2 py-1 rounded w-fit">{log.user_id || 'Anonymous'}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground/80 font-medium">App Version</span>
                                <div className="text-sm text-foreground/90">{log.app_version || 'Unknown'}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground/80 font-medium">User Agent</span>
                                <div className="text-sm text-foreground/90 truncate" title={log.user_agent}>{log.user_agent}</div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-card rounded-xl p-6 shadow-sm border border-border/60">
                        <div className="flex items-center gap-3 mb-4 text-foreground">
                            <Code className="w-5 h-5 text-muted-foreground/80" />
                            <h4 className="font-semibold">Metadata</h4>
                        </div>
                        <pre className="bg-muted/40 p-4 rounded-xl text-xs overflow-x-auto h-50 text-muted-foreground font-mono custom-scrollbar">
                            {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                    </div>
                </div>

                {log.stack_trace && (
                <div className="bg-primary rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-white">
                        <Terminal className="w-5 h-5 text-muted-foreground/80" />
                        <h4 className="font-semibold">Stack Trace</h4>
                    </div>
                    <pre className="text-muted-foreground/50 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[300px] custom-scrollbar">
                        {log.stack_trace}
                    </pre>
                </div>
                )}
                
                {log.component_stack && (
                    <div className="bg-primary rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-white">
                            <Code className="w-5 h-5 text-muted-foreground/80" />
                            <h4 className="font-semibold">Component Stack</h4>
                        </div>
                        <pre className="text-muted-foreground/50 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[300px] custom-scrollbar">
                            {log.component_stack}
                        </pre>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
