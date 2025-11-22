import { handleLogout, type AppRouteHandlerFnContext } from '@auth0/nextjs-auth0/edge'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest, context: { params: Promise<{}> }) {
  const params = await context.params
  const ctx: AppRouteHandlerFnContext = { params }
  const handler = handleLogout()
  return handler(req, ctx)
}
