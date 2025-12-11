import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Read user info passed from middleware via headers
  const userId = request.headers.get('x-user-id');
  const userEmail = request.headers.get('x-user-email');

  if (!userId) {
    // Should be caught by middleware, but double check
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    id: userId,
    email: userEmail,
    message: 'Hello from ChatGPT Action! You are authenticated.',
    timestamp: new Date().toISOString(),
  });
}
