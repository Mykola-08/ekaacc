'use client'

import React from 'react'
import { useSimpleAuth, usePermissions, useUserPreferences } from '@/hooks/use-simple-auth'
import { AuthGuard } from '@/components/auth/auth-guard'

export default function DashboardPage() {
  const { user, signOut } = useSimpleAuth()
  const permissions = usePermissions()
  const preferences = useUserPreferences()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome, {user?.profile.full_name || user?.email}!
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">User Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> {user?.email}</p>
                      <p><strong>Username:</strong> {user?.profile.username || 'Not set'}</p>
                      <p><strong>Role:</strong> {user?.role.name}</p>
                      <p><strong>Member since:</strong> {new Date(user?.profile.created_at || '').toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Preferences</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Theme:</strong> {preferences.theme}</p>
                      <p><strong>Language:</strong> {preferences.language}</p>
                      <p><strong>Timezone:</strong> {preferences.timezone}</p>
                      <p><strong>Email Notifications:</strong> {preferences.emailNotifications ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your Permissions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      {Object.entries(permissions).map(([key, hasPermission]) => (
                        <div key={key} className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${hasPermission ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className={hasPermission ? 'text-green-700' : 'text-red-700'}>
                            {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => signOut()}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
