'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteFamilyMember } from "@/server/family/actions"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function FamilyList({ members }: { members: any[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  if (!members || members.length === 0) {
      return (
          <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground animate-in fade-in zoom-in duration-500">
              <User className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p>No family members added yet.</p>
              <p className="text-xs mt-1 text-muted-foreground/70">Add a dependent to book services for them.</p>
          </div>
      )
  }

  async function handleDelete() {
      if (!deletingId) return
      
      const res = await deleteFamilyMember(deletingId)
      if (res.success) {
          toast.success("Family member removed")
      } else {
          toast.error(res.message || "Failed to remove member")
      }
      setDeletingId(null)
  }

  return (
    <>
    <div className="grid gap-4 md:grid-cols-2">
        {members.map(member => (
            <Card key={member.id} className="relative group overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <Avatar className="h-10 w-10 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {member.full_name?.charAt(0) || <User className="h-4 w-4" />}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{member.full_name}</CardTitle>
                        <CardDescription className="capitalize text-xs">
                            {member.metadata?.relationship || 'Dependent'}
                        </CardDescription>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setDeletingId(member.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                       <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                         {member.dob ? `Born: ${new Date(member.dob).getFullYear()}` : 'Age unknown'}
                       </span>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>

    <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    Remove Family Member?
                </DialogTitle>
                <DialogDescription>
                    Are you sure you want to remove this family member? This action cannot be undone and will unlink their booking history.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Remove Member</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  )
}
