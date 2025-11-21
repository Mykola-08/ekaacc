import { handleLogout } from '@auth0/nextjs-auth0/edge'

export const runtime = 'edge'

export async function GET(request: Request) {
  return handleLogout(request, {
    returnTo: process.env.POST_LOGOUT_REDIRECT || '/' 
  })
}
