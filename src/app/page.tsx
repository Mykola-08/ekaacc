'use client'

import Link from 'next/link'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { AuthGuard } from '@/components/auth/auth-guard'

export default function HomePage() {
  const { isAuthenticated, user } = useSimpleAuth()

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to EKA Account
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Hello, {user?.profile.full_name || user?.email}!
            </p>
            <div className="space-x-4">
              <Link
                href="/dashboard"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to EKA Account
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The central hub for your EKA ecosystem.
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-block bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
