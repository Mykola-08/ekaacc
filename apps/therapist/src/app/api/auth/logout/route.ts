import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const authAppUrl = process.env.NEXT_PUBLIC_AUTH_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://auth.ekabalance.com' : 'http://localhost:9005')
  const logoutUrl = new URL(`${authAppUrl}/logout`)
  logoutUrl.searchParams.set('returnTo', new URL('/', req.url).toString())
  
  return NextResponse.redirect(logoutUrl)
}
