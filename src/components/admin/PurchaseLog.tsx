'use client';

import { logExternalPurchase } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MorphingActionButton } from '@/components/ui/MorphingActionButton';
import { useState } from 'react';
import { morphToast } from '@/components/ui/morphing-toaster';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';

export function PurchaseLog({ userId, purchases }: any) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (formData: FormData) => {
    setStatus('loading');
    const result = await logExternalPurchase(null, formData);
    if (result?.message === 'Success') {
      setStatus('success');
      morphToast.success('Purchase logged');
      setTimeout(() => setStatus('idle'), 2000);
    } else {
      setStatus('error');
      morphToast.error(result?.message || 'Failed');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="">
      <form
        action={handleSubmit}
        className="bg-muted/20 flex flex-col items-end gap-4 rounded-[calc(var(--radius)*0.8)] border p-4 md:flex-row"
      >
        <input type="hidden" name="userId" value={userId} />
        <div className="grid w-full gap-2">
          <label className="text-xs font-medium">Item Name</label>
          <Input name="itemName" placeholder="e.g. Magnesium Glycinate" required />
        </div>
        <div className="grid w-full gap-2">
          <label className="text-xs font-medium">Source / Agency</label>
          <Input name="source" placeholder="e.g. Clinic Store or Amazon" required />
        </div>
        <div className="grid w-full gap-2 md:w-37.5">
          <label className="text-xs font-medium">Status</label>
          <Input name="status" placeholder="ordered" defaultValue="ordered" />
        </div>
        <MorphingActionButton
          type="submit"
          status={status}
          idleLabel="Log Purchase"
          icon={<HugeiconsIcon icon={Add01Icon} className="size-4" />}
          className="w-full md:w-auto"
        />
      </form>

      <div className="overflow-hidden rounded-[var(--radius)] border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Item</th>
              <th className="p-3 font-medium">Source</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases?.map((p: any) => (
              <tr key={p.id} className="hover:bg-muted/50 border-b transition-colors last:border-0">
                <td className="p-3 whitespace-nowrap">
                  {new Date(p.purchase_date).toLocaleDateString()}
                </td>
                <td className="p-3 font-medium">{p.item_name}</td>
                <td className="text-muted-foreground p-3">{p.source}</td>
                <td className="p-3">
                  <Badge variant="outline" className="text-xs capitalize">
                    {p.status}
                  </Badge>
                </td>
              </tr>
            ))}
            {(!purchases || purchases.length === 0) && (
              <tr>
                <td colSpan={4} className="text-muted-foreground p-8 text-center">
                  No purchases recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
