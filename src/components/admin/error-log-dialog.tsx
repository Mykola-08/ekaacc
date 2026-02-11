'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AlertTriangle, Code, Terminal, Info, X } from 'lucide-react';

export function ErrorLogDialog({ log }: { log: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-muted-foreground hover:text-foreground hover:border-input h-8 rounded-full px-4 text-xs"
        >
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card max-h-[85vh] max-w-3xl gap-0 overflow-hidden rounded-lg border-none p-0 shadow-sm">
        <div className="bg-muted/30 flex h-full flex-col">
          <DialogHeader className="bg-card border-border/60 border-b p-8 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-foreground font-serif text-2xl">
                  Error Details
                </DialogTitle>
                <DialogDescription className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 font-mono">
                    ID: {log.id}
                  </span>
                  <span>•</span>
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 space-y-8 overflow-y-auto p-8">
            {/* Error Message */}
            <div className="bg-card border-border/60 rounded-xl border p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <h4 className="font-semibold">Error Message</h4>
              </div>
              <div className="text-foreground/90 rounded-xl border border-destructive/20 bg-destructive/10 p-4 font-mono text-sm break-all">
                {log.error_message}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Context Info */}
              <div className="bg-card border-border/60 rounded-xl border p-6 shadow-sm">
                <div className="text-foreground mb-4 flex items-center gap-3">
                  <Info className="text-muted-foreground/80 h-5 w-5" />
                  <h4 className="font-semibold">Context Info</h4>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-muted-foreground/80 text-xs font-medium tracking-wider uppercase">
                      URL
                    </span>
                    <div className="text-foreground/90 text-sm break-all">{log.url}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground/80 text-xs font-medium tracking-wider uppercase">
                      User ID
                    </span>
                    <div className="text-foreground/90 bg-muted/40 w-fit rounded px-2 py-1 font-mono text-sm">
                      {log.user_id || 'Anonymous'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground/80 text-xs font-medium tracking-wider uppercase">
                      App Version
                    </span>
                    <div className="text-foreground/90 text-sm">{log.app_version || 'Unknown'}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground/80 text-xs font-medium tracking-wider uppercase">
                      User Agent
                    </span>
                    <div className="text-foreground/90 truncate text-sm" title={log.user_agent}>
                      {log.user_agent}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-card border-border/60 rounded-xl border p-6 shadow-sm">
                <div className="text-foreground mb-4 flex items-center gap-3">
                  <Code className="text-muted-foreground/80 h-5 w-5" />
                  <h4 className="font-semibold">Metadata</h4>
                </div>
                <pre className="bg-muted/40 text-muted-foreground custom-scrollbar h-50 overflow-x-auto rounded-xl p-4 font-mono text-xs">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            </div>

            {log.stack_trace && (
              <div className="bg-primary rounded-xl p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3 text-primary-foreground">
                  <Terminal className="text-primary-foreground/60 h-5 w-5" />
                  <h4 className="font-semibold">Stack Trace</h4>
                </div>
                <pre className="text-muted-foreground/50 custom-scrollbar max-h-[300px] overflow-x-auto font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {log.stack_trace}
                </pre>
              </div>
            )}

            {log.component_stack && (
              <div className="bg-primary rounded-xl p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3 text-primary-foreground">
                  <Code className="text-primary-foreground/60 h-5 w-5" />
                  <h4 className="font-semibold">Component Stack</h4>
                </div>
                <pre className="text-muted-foreground/50 custom-scrollbar max-h-[300px] overflow-x-auto font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {log.component_stack}
                </pre>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
