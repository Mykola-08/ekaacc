import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const returnTo = req.nextUrl.searchParams.get('returnTo') || '/'
  const authAppUrl = process.env.NEXT_PUBLIC_AUTH_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://auth.ekabalance.com' : 'http://localhost:9005')
  
  const loginUrl = new URL(`${authAppUrl}/login`)
  if (returnTo.startsWith('/')) {
    loginUrl.searchParams.set('returnTo', new URL(returnTo, req.url).toString())
  } else {
    loginUrl.searchParams.set('returnTo', returnTo)
  }
  
  return NextResponse.redirect(loginUrl)
}