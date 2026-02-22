'use client';

import { logExternalPurchase } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function PurchaseLog({ userId, purchases }: any) {
  return (
    <div className="space-y-6">
      <form action={logExternalPurchase} className="flex flex-col md:flex-row gap-4 items-end border p-4 rounded-lg bg-muted/20">
        <input type="hidden" name="userId" value={userId} />
        <div className="grid gap-2 w-full">
           <label className="text-xs font-medium">Item Name</label>
           <Input name="itemName" placeholder="e.g. Magnesium Glycinate" required />
        </div>
        <div className="grid gap-2 w-full">
           <label className="text-xs font-medium">Source / Agency</label>
           <Input name="source" placeholder="e.g. Clinic Store or Amazon" required />
        </div>
        <div className="grid gap-2 w-full md:w-[150px]">
           <label className="text-xs font-medium">Status</label>
           <Input name="status" placeholder="ordered" defaultValue="ordered" />
        </div>
        <Button type="submit" className="w-full md:w-auto">Log Purchase</Button>
      </form>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm text-left">
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
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="p-3 whitespace-nowrap">{new Date(p.purchase_date).toLocaleDateString()}</td>
                <td className="p-3 font-medium">{p.item_name}</td>
                <td className="p-3 text-muted-foreground">{p.source}</td>
                <td className="p-3">
                  <Badge variant="outline" className="capitalize text-xs">{p.status}</Badge>
                </td>
              </tr>
            ))}
            {(!purchases || purchases.length === 0) && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">No purchases recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
