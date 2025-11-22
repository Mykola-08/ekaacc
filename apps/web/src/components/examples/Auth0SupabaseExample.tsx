'use client'

import { useAuth0Supabase } from '@/hooks/useAuth0Supabase'
import { useEffect, useState } from 'react'

/**
 * Example component demonstrating Auth0 + Supabase integration
 * 
 * This component shows:
 * 1. How to check authentication state
 * 2. How to login/logout with Auth0
 * 3. How to access Supabase with Auth0 tokens
 * 4. How to fetch user-specific data from Supabase
 */
export function Auth0SupabaseExample() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    supabase,
  } = useAuth0Supabase()

  const [userData, setUserData] = useState<any>(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user data from Supabase when authenticated
  useEffect(() => {
    if (isAuthenticated && supabase && user) {
      fetchUserData()
    }
  }, [isAuthenticated, supabase, user])

  const fetchUserData = async () => {
    setDataLoading(true)
    setError(null)

    try {
      // Example: Fetch user data from Supabase
      const { data, error } = await supabase!
        .from('users')
        .select('*')
        .eq('id', user!.sub)
        .single()

      if (error) {
        console.error('Error fetching user data:', error)
        setError(error.message)
      } else {
        setUserData(data)
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to fetch user data')
    } finally {
      setDataLoading(false)
    }
  }

  // Handle login
  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
    })
  }

  // Handle logout
  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome</h2>
        <p className="text-gray-600 mb-6">
          Please log in to access your account and data.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Log In with Auth0
        </button>
      </div>
    )
  }

  // Authenticated state
  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      {/* User Profile Section */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b">
        {user?.picture && (
          <img
            src={user.picture}
            alt={user.name || 'User'}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Log Out
        </button>
      </div>

      {/* Auth0 User Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Auth0 User Info</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">User ID:</div>
            <div className="text-gray-600 font-mono text-xs">{user?.sub}</div>
            
            <div className="font-medium">Email Verified:</div>
            <div className="text-gray-600">
              {user?.email_verified ? '✅ Yes' : '❌ No'}
            </div>
            
            <div className="font-medium">Last Updated:</div>
            <div className="text-gray-600">
              {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Data Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Supabase User Data</h3>
          <button
            onClick={fetchUserData}
            disabled={dataLoading}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors disabled:opacity-50"
          >
            {dataLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-medium">Error loading data:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {dataLoading ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Loading data from Supabase...</p>
          </div>
        ) : userData ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            <p className="text-sm">
              User data not found in Supabase. It may take a moment to sync after first login.
            </p>
            <button
              onClick={fetchUserData}
              className="mt-2 text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Example API Call */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Example Usage</h4>
        <p className="text-sm text-blue-800 mb-2">
          This component demonstrates how to:
        </p>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Use the <code className="bg-blue-100 px-1 rounded">useAuth0Supabase</code> hook</li>
          <li>Check authentication state</li>
          <li>Handle login/logout</li>
          <li>Access Supabase with Auth0 tokens</li>
          <li>Fetch user-specific data from Supabase</li>
        </ul>
      </div>
    </div>
  )
}
