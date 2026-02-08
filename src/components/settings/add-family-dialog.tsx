'use client';

import { useState } from 'react';
import { addFamilyMember } from '@/server/family/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, UserPlus, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function AddFamilyDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await addFamilyMember(null, formData);

      if (res.success) {
        setOpen(false);
        toast.success('Family member added successfully');
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 rounded-xl px-5 py-6 text-white shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card overflow-hidden rounded-[20px] border-none p-0 shadow-2xl sm:max-w-106.25">
        <div className="bg-muted/40 border-border/60 border-b p-6 pb-4">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-foreground font-serif text-xl">
              Add Family Member
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a child or dependent to manage their bookings.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-foreground/90 font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="text-muted-foreground/80 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  placeholder="e.g. Maya V."
                  className="bg-muted/40 border-border h-12 rounded-xl pl-10 focus:ring-slate-900/10 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="text-foreground/90 font-medium">
                Date of Birth
              </Label>
              <div className="relative">
                <Calendar className="text-muted-foreground/80 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  className="bg-muted/40 border-border block h-12 w-full rounded-xl pl-10 focus:ring-slate-900/10 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship" className="text-foreground/90 font-medium">
                Relationship
              </Label>
              <Select name="relationship" required defaultValue="child">
                <SelectTrigger className="bg-muted/40 border-border h-12 rounded-xl focus:ring-slate-900/10">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent className="border-border/60 rounded-xl shadow-xl">
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary h-12 w-full rounded-xl text-base font-medium text-white shadow-lg shadow-slate-200 hover:bg-black"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Adding...
                </>
              ) : (
                'Add Member'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
