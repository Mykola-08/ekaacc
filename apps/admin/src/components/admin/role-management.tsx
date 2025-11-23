'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Shield, Key, Plus, Edit, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Role {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
}

interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description: string | null
}

interface RolePermission {
  permission_id: string
  permissions: Permission
}

interface RoleManagementProps {
  className?: string
}

export function RoleManagement({ className }: RoleManagementProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    fetchRoles()
    fetchPermissions()
  }, [])

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching roles:', error)
        return
      }

      setRoles(data || [])
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching permissions:', error)
        return
      }

      setPermissions(data || [])
    } catch (error) {
      console.error('Error fetching permissions:', error)
    }
  }

  const getRolePermissions = async (roleId: string) => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          permission_id,
          permissions(*)
        `)
        .eq('role_id', roleId)

      if (error) {
        console.error('Error fetching role permissions:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching role permissions:', error)
      return []
    }
  }

  const toggleRoleActive = async (roleId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: !currentStatus })
        .eq('id', roleId)

      if (error) {
        console.error('Error updating role status:', error)
        return
      }

      await fetchRoles()
    } catch (error) {
      console.error('Error updating role status:', error)
    }
  }

  const createRole = async (name: string, description: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ name, description })

      if (error) {
        console.error('Error creating role:', error)
        return
      }

      await fetchRoles()
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating role:', error)
    }
  }

  const getBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'destructive'
      case 'moderator':
        return 'default'
      case 'user':
      default:
        return 'secondary'
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Loading roles...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role Management
        </CardTitle>
        <CardDescription>Manage system roles and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Total roles: {roles.length}
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Define a new role with specific permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Role Name</Label>
                    <Input id="name" placeholder="Enter role name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter role description" />
                  </div>
                  <Button 
                    onClick={() => {
                      const name = (document.getElementById('name') as HTMLInputElement)?.value
                      const description = (document.getElementById('description') as HTMLTextAreaElement)?.value
                      if (name) {
                        createRole(name, description)
                      }
                    }}
                  >
                    Create Role
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <Badge variant={getBadgeVariant(role.name)}>
                          {role.name}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {role.description || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={role.is_active}
                          onCheckedChange={() => toggleRoleActive(role.id, role.is_active)}
                        />
                        <span className="text-sm">
                          {role.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {roles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No roles found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}