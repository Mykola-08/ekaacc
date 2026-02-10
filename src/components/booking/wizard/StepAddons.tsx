'use client';

import { Button } from '@/components/ui/button';

export function StepAddons() {
  return (
    <div className="grid gap-4">
      {/* Placeholder usage */}
      <div className="group bg-card hover:bg-secondary border-muted hover:border-foreground flex cursor-pointer items-center justify-between rounded-[20px] border-2 border-dashed p-6 transition-colors">
        <div>
          <h3 className="text-foreground font-bold">Aromatherapy</h3>
          <p className="text-muted-foreground text-sm">Add essential oils for relaxation.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-foreground text-sm font-bold">+€10</span>
          <Button variant="secondary" size="sm" className="rounded-full" disabled>
            Unavailable
          </Button>
        </div>
      </div>

      <div className="bg-primary/5 text-primary rounded-[20px] p-6 text-center text-sm font-medium">
        <p>More enhancements coming soon.</p>
      </div>
    </div>
  );
}
