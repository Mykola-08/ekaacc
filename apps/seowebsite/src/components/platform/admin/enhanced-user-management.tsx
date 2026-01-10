'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card'
import { Button } from '@/components/platform/ui/button'
import { Badge } from '@/components/platform/ui/badge'
import { Input } from '@/components/platform/ui/input'
import { Label } from '@/components/platform/ui/label'
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  Edit,
  Trash2,
  Shield,
  Mail,
  Calendar,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  UserPlus,
  UserMinus
} from 'lucide-react'
import { format } from 'date-fns'

interface User {
  id: string
  email: string
  fullName: string
  role: string
  status: 'active' | 'suspended' | 'pending'
  createdAt: string
  lastLoginAt: string
  emailVerified: boolean
  loginCount: number
  preferences: any
}

interface BulkOperation {
  type: 'suspend' | 'activate' | 'delete' | 'role_change'
  userIds: string[]
  details: any
}

export function EnhancedUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(50)
  const [bulkOperationLoading, setBulkOperationLoading] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkAction, setBulkAction] = useState<string>('')

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      })

      const response = await fetch(`/api/admin/users/enhanced?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      
      setUsers(data.users)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, roleFilter, statusFilter])

  const handleBulkOperation = async (operation: string) => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user')
      return
    }

    if (!confirm(`Are you sure you want to ${operation} ${selectedUsers.length} user(s)?`)) {
      return
    }

    try {
      setBulkOperationLoading(true)
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: operation,
          userIds: selectedUsers,
          details: {}
        })
      })

      if (!response.ok) throw new Error('Bulk operation failed')
      
      setSelectedUsers([])
      fetchUsers()
      alert(`Successfully ${operation}d ${selectedUsers.length} user(s)`)
    } catch (error) {
      console.error('Error performing bulk operation:', error)
      alert('Failed to perform bulk operation')
    } finally {
      setBulkOperationLoading(false)
      setShowBulkModal(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const params = new URLSearchParams({
        type: 'users',
        format,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      })

      const response = await fetch(`/api/admin/reports?${params}`)
      if (!response.ok) throw new Error('Failed to export users')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users-export-${new Date().toISOString()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting users:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800"><Shield className="h-3 w-3 mr-1" />Admin</Badge>
      case 'user':
        return <Badge className="bg-blue-100 text-blue-800">User</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(user => user.id))
    }
  }

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage users, roles, and access permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
            >
              <Download className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Bulk Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Bulk Operations</CardTitle>
          <CardDescription>Search and manage multiple users at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="role-filter">Role</Label>
                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="flex-1">
                <Label htmlFor="status-filter">Status</Label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Bulk Operations */}
            {selectedUsers.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-800">
                  {selectedUsers.length} user(s) selected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkOperation('activate')}
                    disabled={bulkOperationLoading}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Activate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkOperation('suspend')}
                    disabled={bulkOperationLoading}
                  >
                    <UserMinus className="h-3 w-3 mr-1" />
                    Suspend
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkOperation('delete')}
                    disabled={bulkOperationLoading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users ({users.length})</CardTitle>
              <CardDescription>User accounts and their current status</CardDescription>
            </div>
            <Badge variant="outline">{selectedUsers.length} selected</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-gray-500 text-xs flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900">{format(new Date(user.createdAt), 'MMM dd, yyyy')}</div>
                    </td>
                    <td className="py-3 px-4">
                      {user.lastLoginAt ? (
                        <div className="text-gray-900">{format(new Date(user.lastLoginAt), 'MMM dd, yyyy')}</div>
                      ) : (
                        <div className="text-gray-400 text-xs">Never</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}