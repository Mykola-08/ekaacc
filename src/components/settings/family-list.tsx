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
            <div 
                key={member.id} 
                className="group relative flex items-start gap-4 p-5 bg-card rounded-3xl border border-border/60 shadow-sm transition-all hover:shadow-lg hover:border-border hover:-translate-y-1"
            >
                <Avatar className="h-12 w-12 border border-border/60 bg-muted/40">
                    <AvatarFallback className="bg-muted/50 text-muted-foreground font-serif text-lg">
                        {member.full_name?.charAt(0) || <User className="h-5 w-5" />}
                    </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="font-semibold text-foreground truncate mb-1">{member.full_name}</h3>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium capitalize">
                            {member.metadata?.relationship || 'Dependent'}
                        </span>
                        {member.dob && (
                            <span className="text-muted-foreground/80">
                                • Born {new Date(member.dob).getFullYear()}
                            </span>
                        )}
                    </div>
                </div>

                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all absolute top-3 right-3"
                    onClick={() => setDeletingId(member.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ))}
    </div>

    <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-100 bg-card border-none shadow-2xl rounded-4xl p-0 overflow-hidden">
             <div className="p-8 pb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <DialogTitle className="text-xl font-serif text-foreground mb-2">
                   Remove Family Member?
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                    Are you sure you want to remove this family member? This action cannot be undone.
                </DialogDescription>
             </div>
             
             <div className="bg-muted/40 p-6 flex gap-3">
                <Button 
                    variant="outline" 
                    onClick={() => setDeletingId(null)}
                    className="flex-1 rounded-xl h-11 border-border hover:bg-card hover:text-foreground"
                >
                    Cancel
                </Button>
                <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    className="flex-1 rounded-xl h-11 bg-red-500 hover:bg-red-600 shadow-md shadow-red-200"
                >
                    Remove Member
                </Button>
             </div>
        </DialogContent>
    </Dialog>
    </>
  )
}

