'use client'

import React, { useState, useEffect } from 'react'
import { Search, User, Shield, AlertTriangle, X, Eye, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/auth-context'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  role: {
    name: string
    description: string | null
  }
  created_at: string
  last_active: string | null
}

interface UserImpersonationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImpersonate: (userId: string, reason: string) => Promise<void>
}

export function UserImpersonationDialog({ open, onOpenChange, onImpersonate }: UserImpersonationDialogProps) {
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [impersonationReason, setImpersonationReason] = useState('')
  const [isImpersonating, setIsImpersonating] = useState(false)

  // Fetch users for impersonation
  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user_role_assignments!inner(
            role_id,
            user_roles!inner(name, description)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching users:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch users',
          variant: 'destructive'
        })
        return
      }

      const formattedUsers = data.map((user: any) => ({
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: {
          name: user.user_role_assignments.user_roles.name,
          description: user.user_role_assignments.user_roles.description
        },
        created_at: user.created_at,
        last_active: user.updated_at
      }))

      setUsers(formattedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleImpersonate = async () => {
    if (!selectedUser || !impersonationReason.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please select a user and provide a reason for impersonation',
        variant: 'destructive'
      })
      return
    }

    setIsImpersonating(true)
    try {
      await onImpersonate(selectedUser.id, impersonationReason)
      onOpenChange(false)
      setSelectedUser(null)
      setImpersonationReason('')
    } catch (error) {
      console.error('Impersonation error:', error)
      toast({
        title: 'Impersonation Failed',
        description: error instanceof Error ? error.message : 'Failed to start impersonation',
        variant: 'destructive'
      })
    } finally {
      setIsImpersonating(false)
    }
  }

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'destructive'
      case 'therapist':
        return 'default'
      case 'user':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Impersonation
          </DialogTitle>
          <DialogDescription>
            Select a user to impersonate. This action will be logged for security purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You are about to impersonate another user. All actions taken during impersonation will be logged.
              Make sure to provide a valid reason for this action.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by email, username, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[300px] border rounded-lg">
              <div className="p-4 space-y-2">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-muted-foreground">Loading users...</div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-muted-foreground">No users found</div>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <Card
                      key={user.id}
                      className={`cursor-pointer transition-colors ${
                        selectedUser?.id === user.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>
                              {getInitials(user.full_name, user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{user.full_name || user.username || user.email}</p>
                              <Badge variant={getRoleBadgeColor(user.role.name)}>
                                {user.role.name}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Member since {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {selectedUser?.id === user.id && (
                            <Eye className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {selectedUser && (
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Impersonation *</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a detailed reason for impersonating this user..."
                value={impersonationReason}
                onChange={(e) => setImpersonationReason(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setSelectedUser(null)
              setImpersonationReason('')
            }}
            disabled={isImpersonating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImpersonate}
            disabled={!selectedUser || !impersonationReason.trim() || isImpersonating}
          >
            {isImpersonating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Starting Impersonation...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Start Impersonation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ImpersonationBannerProps {
  impersonation: {
    originalUserEmail: string
    targetUserEmail: string
    reason: string
    startedAt: string
  }
  onEndImpersonation: () => void
}

export function ImpersonationBanner({ impersonation, onEndImpersonation }: ImpersonationBannerProps) {
  const [isEnding, setIsEnding] = useState(false)

  const handleEndImpersonation = async () => {
    setIsEnding(true)
    try {
      await onEndImpersonation()
    } catch (error) {
      console.error('Error ending impersonation:', error)
    } finally {
      setIsEnding(false)
    }
  }

  return (
    <div className="bg-amber-100 border-b border-amber-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-amber-600" />
          <div className="text-sm">
            <span className="font-medium text-amber-800">
              Impersonating: {impersonation.targetUserEmail}
            </span>
            <span className="text-amber-700 ml-2">
              (Original: {impersonation.originalUserEmail})
            </span>
            <span className="text-amber-600 ml-2">
              • Reason: {impersonation.reason}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEndImpersonation}
          disabled={isEnding}
          className="border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          {isEnding ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-amber-700 mr-2" />
              Ending...
            </>
          ) : (
            <>
              <LogOut className="h-3 w-3 mr-2" />
              End Impersonation
            </>
          )}
        </Button>
      </div>
    </div>
  )
}