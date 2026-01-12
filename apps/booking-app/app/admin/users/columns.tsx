"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Shield, ShieldAlert, ShieldCheck } from "lucide-react"
import { 
 DropdownMenu, 
 DropdownMenuContent, 
 DropdownMenuItem, 
 DropdownMenuLabel, 
 DropdownMenuSeparator, 
 DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { UserProfile } from "@/server/admin/user-actions"
import Link from "next/link"

export const columns: ColumnDef<UserProfile>[] = [
 {
  accessorKey: "email",
  header: "User",
  cell: ({ row }) => {
   const user = row.original
   return (
    <div className="flex flex-col">
     <span className="font-medium">{user.fullName || "N/A"}</span>
     <span className="text-xs text-muted-foreground">{user.email}</span>
    </div>
   )
  },
 },
 {
  accessorKey: "role",
  header: "Role",
  cell: ({ row }) => {
   const role = row.original.role || 'user'
   return (
    <Badge variant={role === 'admin' ? 'destructive' : 'secondary'}>
     {role}
    </Badge>
   )
  },
 },
 {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
   const status = row.original.status
   return (
    <Badge variant={status === 'active' ? 'default' : status === 'suspended' ? 'destructive' : 'outline'}>
     {status}
    </Badge>
   )
  },
 },
 {
  accessorKey: "lastLogin",
  header: "Last Active",
  cell: ({ row }) => {
   const date = row.original.lastLogin
   return <span className="text-sm text-muted-foreground">{date ? new Date(date).toLocaleDateString() : 'Never'}</span>
  },
 },
 {
  accessorKey: "createdAt",
  header: "Joined",
  cell: ({ row }) => {
    return <span className="text-sm text-muted-foreground">{new Date(row.original.createdAt).toLocaleDateString()}</span>
  }
 },
 {
  id: "actions",
  cell: ({ row }) => {
   const user = row.original
 
   return (
    <DropdownMenu>
     <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
       <span className="sr-only">Open menu</span>
       <MoreHorizontal className="h-4 w-4" />
      </Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem asChild>
        <Link href={`/admin/users/${user.id}`}>View Details</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={`/admin/users/${user.id}?edit=true`}>Edit Profile</Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-destructive">
        <ShieldAlert className="mr-2 h-4 w-4" />
        Block User
      </DropdownMenuItem>
     </DropdownMenuContent>
    </DropdownMenu>
   )
  },
 },
]
