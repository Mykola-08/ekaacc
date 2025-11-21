#!/usr/bin/env node
/**
 * Verifies Auth0 connections & enabled strategies; prints summary.
 * Requires env: AUTH0_DOMAIN, AUTH0_MGMT_CLIENT_ID, AUTH0_MGMT_CLIENT_SECRET.
 */

import 'dotenv/config'

const domain = process.env.AUTH0_DOMAIN
const clientId = process.env.AUTH0_MGMT_CLIENT_ID
const clientSecret = process.env.AUTH0_MGMT_CLIENT_SECRET

if (!domain || !clientId || !clientSecret) {
  console.error('[auth0-connections] Missing required env vars AUTH0_DOMAIN, AUTH0_MGMT_CLIENT_ID, AUTH0_MGMT_CLIENT_SECRET')
  process.exit(1)
}

async function getToken() {
  const res = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${domain}/api/v2/`
    })
  })
  if (!res.ok) throw new Error('Failed to obtain management token')
  return res.json()
}

async function listConnections(token) {
  const res = await fetch(`https://${domain}/api/v2/connections?fields=name,enabled_clients,strategy&per_page=100`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to list connections')
  return res.json()
}

;(async () => {
  try {
    const { access_token } = await getToken()
    const connections = await listConnections(access_token)
    const summary = connections.map(c => ({ name: c.name, strategy: c.strategy, enabledClients: c.enabled_clients?.length || 0 }))
    console.table(summary)
    // Basic recommended set check
    const recommended = ['google-oauth2','github','apple','linkedin','email','sms']
    const existingNames = new Set(connections.map(c => c.name))
    const missing = recommended.filter(r => !existingNames.has(r))
    if (missing.length) {
      console.warn('[auth0-connections] Missing recommended connections:', missing.join(', '))
    } else {
      console.log('[auth0-connections] All recommended connections present.')
    }
  } catch (e) {
    console.error('[auth0-connections] Error:', e.message)
    process.exitCode = 1
  }
})()
