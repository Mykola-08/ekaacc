'use client'

import React from 'react'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface OAuthButtonProps {
  provider: 'google' | 'github' | 'twitter' | 'linkedin'
  className?: string
}

const providerConfig = {
  google: {
    name: 'Google',
    className: 'bg-red-600 hover:bg-red-700 text-white',
    icon: '🔍',
  },
  github: {
    name: 'GitHub',
    className: 'bg-gray-800 hover:bg-gray-900 text-white',
    icon: '🐙',
  },
  twitter: {
    name: 'Twitter',
    className: 'bg-blue-400 hover:bg-blue-500 text-white',
    icon: '🐦',
  },
  linkedin: {
    name: 'LinkedIn',
    className: 'bg-blue-700 hover:bg-blue-800 text-white',
    icon: '💼',
  },
}

export function OAuthButton({ provider, className = '' }: OAuthButtonProps) {
  const { signInWithOAuth, isLoading } = useSimpleAuth()
  const config = providerConfig[provider]

  const handleClick = async () => {
    try {
      // Show loading state
      const button = document.querySelector(`[data-oauth-provider="${provider}"]`)
      if (button) {
        button.setAttribute('disabled', 'true')
      }

      // Attempt OAuth sign in
      const { error } = await signInWithOAuth(provider)
      
      if (error) {
        console.error(`OAuth sign in failed for ${provider}:`, error)
        // Restore button state
        if (button) {
          button.removeAttribute('disabled')
        }
      }
      // If successful, the page will redirect, so no need to handle success here
    } catch (error) {
      console.error(`Unexpected error during OAuth sign in for ${provider}:`, error)
      // Restore button state
      const button = document.querySelector(`[data-oauth-provider="${provider}"]`)
      if (button) {
        button.removeAttribute('disabled')
      }
    }
  }

  return (
    <Button
      data-oauth-provider={provider}
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 ${config.className} ${className}`}
      variant="default"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <span className="text-lg">{config.icon}</span>
          Continue with {config.name}
        </>
      )}
    </Button>
  )
}

export function OAuthButtons() {
  return (
    <div className="space-y-3">
      <div className="text-center text-sm text-muted-foreground mb-2">
        Or continue with
      </div>
      <OAuthButton provider="google" />
      <OAuthButton provider="github" />
      <OAuthButton provider="twitter" />
      <OAuthButton provider="linkedin" />
    </div>
  )
}