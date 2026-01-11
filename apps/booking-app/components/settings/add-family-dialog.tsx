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
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"

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
        <Button className="transition-all hover:scale-105 active:scale-95">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription>
            Add a child or dependent to manage their bookings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" required placeholder="e.g. Maya V." className="focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" name="dob" type="date" className="block w-full" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Select name="relationship" required defaultValue="child">
                    <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
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
