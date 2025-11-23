import { handleLogout } from '@auth0/nextjs-auth0'
import type { NextRequest } from 'next/server'

export const GET = async (req: NextRequest) => {
  return handleLogout()(req, { params: {} });
}
