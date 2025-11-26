import { auth0 } from '@/lib/auth0'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest, props: { params: Promise<{ connection: string }> }) {
  const params = await props.params
  return auth0.startInteractiveLogin({
    authorizationParameters: {
      connection: params.connection
    }
  })
}