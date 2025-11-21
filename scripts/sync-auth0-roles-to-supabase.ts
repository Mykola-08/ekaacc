#!/usr/bin/env ts-node
/**
 * Sync Auth0 user roles (app_metadata.roles) into Supabase users table.
 *
 * Requirements:
 *  - AUTH0_MGMT_DOMAIN (e.g. ekabalance.eu.auth0.com or custom domain)
 *  - AUTH0_MGMT_CLIENT_ID / AUTH0_MGMT_CLIENT_SECRET (Machine-to-Machine Application)
 *  - SUPABASE_URL
 *  - SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *  AUTH0_MGMT_DOMAIN=auth.ekabalance.com \
 *  AUTH0_MGMT_CLIENT_ID=xxxxx AUTH0_MGMT_CLIENT_SECRET=xxxxx \
 *  SUPABASE_URL=https://rbnfyxhewsivofvwdpuk.supabase.co \
 *  SUPABASE_SERVICE_ROLE_KEY=xxxxx \
 *  ts-node scripts/sync-auth0-roles-to-supabase.ts
 */
import fetch from 'node-fetch'

interface Auth0User {
  user_id: string
  email: string
  app_metadata?: { roles?: string[]; tenant_id?: string }
}

async function getManagementToken() {
  const domain = process.env.AUTH0_MGMT_DOMAIN
  const clientId = process.env.AUTH0_MGMT_CLIENT_ID
  const clientSecret = process.env.AUTH0_MGMT_CLIENT_SECRET
  if (!domain || !clientId || !clientSecret) throw new Error('Missing Auth0 management credentials')
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
  if (!res.ok) throw new Error(`Failed to get management token: ${res.status}`)
  const data = await res.json()
  return data.access_token as string
}

async function listAuth0Users(token: string): Promise<Auth0User[]> {
  const domain = process.env.AUTH0_MGMT_DOMAIN!
  const users: Auth0User[] = []
  let page = 0
  const perPage = 50
  while (true) {
    const res = await fetch(`https://${domain}/api/v2/users?page=${page}&per_page=${perPage}&fields=user_id,email,app_metadata`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error(`Failed to list users page=${page}`)
    const batch = await res.json()
    if (!Array.isArray(batch) || batch.length === 0) break
    users.push(...batch)
    if (batch.length < perPage) break
    page++
  }
  return users
}

async function upsertUsersToSupabase(users: Auth0User[]) {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) throw new Error('Missing Supabase credentials')
  const endpoint = `${supabaseUrl}/rest/v1/users`
  for (const u of users) {
    const roles = u.app_metadata?.roles || ['user']
    const tenant = u.app_metadata?.tenant_id || 'default'
    const payload = {
      id: u.user_id,
      email: u.email,
      auth_provider: 'auth0',
      app_metadata: u.app_metadata || {},
      role: roles[0],
      updated_at: new Date().toISOString(),
      user_metadata: { tenant_id: tenant },
    }
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      console.warn(`Upsert failed for ${u.user_id}: ${res.status}`)
    }
  }
}

async function main() {
  try {
    console.log('Obtaining Auth0 management token...')
    const token = await getManagementToken()
    console.log('Listing Auth0 users...')
    const users = await listAuth0Users(token)
    console.log(`Fetched ${users.length} users. Syncing to Supabase...`)
    await upsertUsersToSupabase(users)
    console.log('Sync complete.')
  } catch (err) {
    console.error('Sync error:', (err as Error).message)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
