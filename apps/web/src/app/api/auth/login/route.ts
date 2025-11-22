import { handleLogin, type AppRouteHandlerFnContext } from '@auth0/nextjs-auth0/edge'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest, context: { params: Promise<{}> }) {
  const params = await context.params
  const ctx: AppRouteHandlerFnContext = { params }
  // Initialize handler lazily to avoid build-time header access
  const handler = handleLogin()
  return handler(req, ctx)
}