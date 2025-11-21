// Temporary shim while migrating from deprecated `middleware.ts` to Next.js 16 `proxy` convention.
// Delegates to existing middleware logic for compatibility.
import type { NextRequest } from 'next/server'
import { middleware as legacyMiddleware } from './middleware'

export function proxy(req: NextRequest) {
  return legacyMiddleware(req)
}

export const config = {
  matcher: [
    '/((?!api/auth/callback|api/auth/logout|favicon.ico|_next|static).*)'
  ]
}