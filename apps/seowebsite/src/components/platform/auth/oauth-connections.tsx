/**
 * OAuth Connections Component
 * Shows which OAuth providers are connected and allows managing connections
 */

'use client'

import React, { useEffect, useState } from 'react'
import { useSimpleAuth } from '@/hooks/platform/use-simple-auth'
import { 
  getAllProviderTokens, 
  deleteProviderTokens,
  type ProviderToken 
} from '@/services/provider-tokens-service'

interface ConnectedProvider {
  provider: ProviderToken['provider']
  connectedAt: string
  tokenExpiresAt: string | null
  scopes: string[] | null
}

export function OAuthConnections() {
  const { user } = useSimpleAuth()
  const [connections, setConnections] = useState<ConnectedProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadConnections()
    }
  }, [user])

  const loadConnections = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await getAllProviderTokens(user.id)

    if (!error && data) {
      setConnections(data.map(token => ({
        provider: token.provider,
        connectedAt: token.updated_at,
        tokenExpiresAt: token.token_expires_at,
        scopes: token.scopes,
      })))
    }

    setLoading(false)
  }

  const handleDisconnect = async (provider: ProviderToken['provider']) => {
    if (!user) return

    if (!confirm(`Are you sure you want to disconnect ${provider}? You'll need to reconnect to access ${provider} features.`)) {
      return
    }

    setDisconnecting(provider)

    const { error } = await deleteProviderTokens(user.id, provider)

    if (error) {
      alert(`Failed to disconnect ${provider}. Please try again.`)
    } else {
      // Remove from list
      setConnections(prev => prev.filter(c => c.provider !== provider))
    }

    setDisconnecting(null)
  }

  const getProviderInfo = (provider: string) => {
    const config: Record<string, { name: string; icon: string; color: string }> = {
      google: { name: 'Google', icon: '🔍', color: 'bg-red-600' },
      github: { name: 'GitHub', icon: '💻', color: 'bg-gray-800' },
      twitter: { name: 'Twitter', icon: '🐦', color: 'bg-blue-400' },
      linkedin: { name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
      apple: { name: 'Apple', icon: '🍎', color: 'bg-black' },
      facebook: { name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
    }
    return config[provider] || { name: provider, icon: '🔗', color: 'bg-gray-500' }
  }

  if (!user) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <p className="text-gray-600">Please sign in to manage OAuth connections</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <p className="text-gray-600">Loading connections...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Connected Accounts</h3>
        <p className="text-sm text-gray-600 mb-4">
          Manage your connected OAuth providers. Connecting accounts allows us to access certain features on your behalf.
        </p>
      </div>

      {connections.length === 0 ? (
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="text-gray-600">No OAuth providers connected yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {connections.map((connection) => {
            const providerInfo = getProviderInfo(connection.provider)
            const isExpired = connection.tokenExpiresAt 
              ? new Date(connection.tokenExpiresAt) < new Date()
              : false

            return (
              <div
                key={connection.provider}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${providerInfo.color} flex items-center justify-center text-white text-xl`}>
                    {providerInfo.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{providerInfo.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Connected: {new Date(connection.connectedAt).toLocaleDateString()}</p>
                      {connection.tokenExpiresAt && (
                        <p className={isExpired ? 'text-red-600' : 'text-gray-600'}>
                          Token {isExpired ? 'expired' : 'expires'}: {new Date(connection.tokenExpiresAt).toLocaleString()}
                        </p>
                      )}
                      {connection.scopes && connection.scopes.length > 0 && (
                        <details className="text-xs">
                          <summary className="cursor-pointer hover:text-gray-900">
                            {connection.scopes.length} scope(s)
                          </summary>
                          <ul className="mt-1 ml-4 list-disc">
                            {connection.scopes.map((scope, idx) => (
                              <li key={idx}>{scope}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDisconnect(connection.provider)}
                  disabled={disconnecting === connection.provider}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {disconnecting === connection.provider ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 About OAuth Connections</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc ml-4">
          <li>Connected accounts allow access to third-party services on your behalf</li>
          <li>We securely store access tokens to make API calls to these services</li>
          <li>You can disconnect at any time - this will remove stored tokens</li>
          <li>Some features may require reconnecting to grant additional permissions</li>
          <li>Tokens are automatically refreshed when they expire</li>
        </ul>
      </div>
    </div>
  )
}
