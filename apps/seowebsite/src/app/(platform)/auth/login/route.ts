import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin
  
  // Redirect to the local login page
  return NextResponse.redirect(`${origin}/login`)
}
