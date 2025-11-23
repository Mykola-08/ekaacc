'use client'

import { Auth0Provider as Auth0ProviderBase } from '@auth0/auth0-react'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface Auth0ProviderProps {
  children: ReactNode
}

export function Auth0Provider({ children }: Auth0ProviderProps) {
  const router = useRouter()

  // Select appropriate environment-specific configuration
  const isProd = process.env.NODE_ENV === 'production'
  const domain = isProd ? process.env.PROD_AUTH0_DOMAIN : process.env.NEXT_PUBLIC_AUTH0_DOMAIN
  const clientId = isProd ? process.env.PROD_AUTH0_CLIENT_ID : process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
  const audience = isProd ? process.env.PROD_AUTH0_AUDIENCE : process.env.AUTH0_AUDIENCE
  const scope = isProd ? (process.env.PROD_AUTH0_SCOPE || 'openid profile email offline_access') : (process.env.AUTH0_SCOPE || 'openid profile email')
  const organization = isProd ? process.env.PROD_AUTH0_ORG_ID : process.env.DEV_AUTH0_ORG_ID
  const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback` : undefined

  if (!domain || !clientId) {
    console.error('[Auth0] Configuration missing. Ensure environment variables are set.')
    return <>{children}</>
  }

  return (
    <Auth0ProviderBase
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience || undefined,
        scope,
        ...(organization ? { organization } : {}),
      }}
      useRefreshTokens
      cacheLocation={isProd ? 'memory' : 'localstorage'}
      onRedirectCallback={(appState) => {
        router.push(appState?.returnTo || '/dashboard')
      }}
    >
      {children}
    </Auth0ProviderBase>
  )
}
