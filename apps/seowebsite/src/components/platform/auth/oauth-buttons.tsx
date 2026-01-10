'use client'

import React from 'react'
import { useSimpleAuth } from '@/hooks/platform/use-simple-auth'

interface OAuthButtonProps {
  provider: 'google' | 'github' | 'twitter' | 'linkedin'
  className?: string
}

const providerConfig = {
  google: {
    name: 'Google',
    className: 'bg-red-600 hover:bg-red-700',
  },
  github: {
    name: 'GitHub',
    className: 'bg-gray-800 hover:bg-gray-900',
  },
  twitter: {
    name: 'Twitter',
    className: 'bg-blue-400 hover:bg-blue-500',
  },
  linkedin: {
    name: 'LinkedIn',
    className: 'bg-blue-700 hover:bg-blue-800',
  },
}

export function OAuthButton({ provider, className = '' }: OAuthButtonProps) {
  const { signInWithOAuth, isLoading } = useSimpleAuth()
  const config = providerConfig[provider]

  const handleClick = async () => {
    await signInWithOAuth(provider)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${config.className} ${className}`}
    >
      Continue with {config.name}
    </button>
  )
}

export function OAuthButtons() {
  return (
    <div className="space-y-3">
      <OAuthButton provider="google" />
      <OAuthButton provider="github" />
      <OAuthButton provider="twitter" />
      <OAuthButton provider="linkedin" />
    </div>
  )
}