import { handleLogout } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return handleLogout(req)
}
