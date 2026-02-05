'use client'

import { useState } from 'react'
import { addFamilyMember } from '@/server/family/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, UserPlus, Calendar, User } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function AddFamilyDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setLoading(true)
      const formData = new FormData(e.currentTarget)
      
      try {
        const res = await addFamilyMember(null, formData)
        
        if (res.success) {
            setOpen(false)
            toast.success("Family member added successfully")
        } else {
            toast.error(res.message)
        }
      } catch (err) {
        toast.error("Something went wrong")
      } finally {
        setLoading(false)
      }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white rounded-xl px-5 py-6 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25 bg-card border-none shadow-2xl rounded-4xl p-0 overflow-hidden">
        <div className="bg-muted/40 border-b border-border/60 p-6 pb-4">
            <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-xl font-serif text-foreground">Add Family Member</DialogTitle>
            <DialogDescription className="text-muted-foreground">
                Add a child or dependent to manage their bookings.
            </DialogDescription>
            </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-foreground/90 font-medium">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                        <Input 
                            id="full_name" 
                            name="full_name" 
                            required 
                            placeholder="e.g. Maya V." 
                            className="pl-10 h-12 bg-muted/40 border-border rounded-xl focus:ring-slate-900/10 focus-visible:ring-offset-0" 
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="dob" className="text-foreground/90 font-medium">Date of Birth</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                        <Input 
                            id="dob" 
                            name="dob" 
                            type="date" 
                            className="pl-10 h-12 bg-muted/40 border-border rounded-xl block w-full focus:ring-slate-900/10 focus-visible:ring-offset-0" 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="relationship" className="text-foreground/90 font-medium">Relationship</Label>
                    <Select name="relationship" required defaultValue="child">
                        <SelectTrigger className="h-12 bg-muted/40 border-border rounded-xl focus:ring-slate-900/10">
                            <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/60 shadow-xl">
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
                    className="w-full bg-primary text-white hover:bg-black rounded-xl h-12 text-base font-medium shadow-lg shadow-slate-200"
                >
                    {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
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
  )
}
