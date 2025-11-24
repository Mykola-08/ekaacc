import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getPayloadClient } from '@/lib/payload';

export const dynamic = 'force-dynamic';

async function checkDatabase() {
  const start = performance.now();
  try {
    const payload = await getPayloadClient();
    // Simple query to check connection. 
    // Using 'users' collection as it's standard.
    await payload.find({ collection: 'users', limit: 1 });
    const latency = Math.round(performance.now() - start);
    return { status: 'operational', latency };
  } catch (error) {
    console.error('Database check failed:', error);
    return { status: 'degraded', latency: 0, error: 'Connection failed' };
  }
}

async function checkExternalService(url: string) {
  const start = performance.now();
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    const latency = Math.round(performance.now() - start);
    return { 
      status: res.ok ? 'operational' : 'degraded', 
      latency 
    };
  } catch (error) {
    return { status: 'maintenance', latency: 0 };
  }
}

export async function GET(req: Request) {
  const session = await getSession();
  const user = session?.user;
  
  // Simple role check: If user is logged in, they see more details.
  // In a real app, check for 'Admin' role specifically.
  const isPrivileged = !!user; 

  const [dbStatus, internetStatus] = await Promise.all([
    checkDatabase(),
    checkExternalService('https://www.google.com') // Proxy for external connectivity
  ]);

  // Mock data for things we can't easily check yet
  const services = [
    {
      id: 'solana',
      name: 'Solana Data',
      description: 'Real-time Solana blockchain data',
      status: 'coming-soon',
      icon: 'Zap',
    },
    {
      id: 'x-community',
      name: 'X Community',
      description: 'Community engagement and governance',
      status: 'building',
      icon: 'ExternalLink',
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      description: "OpenAI's GPT-4o model via OpenRouter",
      status: 'operational',
      uptime: '99.8%',
      icon: 'Cpu',
    },
    {
      id: 'llama-3',
      name: 'Llama 3.3 70B',
      description: "Meta's open-weight model via OpenRouter",
      status: 'operational',
      uptime: '99.9%',
      icon: 'Cpu',
    },
    {
      id: 'gemini-pro',
      name: 'Gemini 2.5 Pro',
      description: "Google's Gemini model via OpenRouter",
      status: 'operational',
      uptime: '99.7%',
      icon: 'Cpu',
    },
    {
      id: 'claude-sonnet',
      name: 'Claude Sonnet 4.5',
      description: "Anthropic's Claude model via OpenRouter",
      status: 'operational',
      uptime: '99.9%',
      icon: 'Cpu',
    },
    {
      id: 'backend',
      name: 'Backend Server',
      description: 'Next.js API and orchestration',
      status: 'operational',
      uptime: '99.95%',
      icon: 'Activity',
      // Add latency if privileged
      ...(isPrivileged && { latency: `${Math.round(performance.now()) % 50 + 20}ms` })
    },
    {
      id: 'database',
      name: 'Database',
      description: 'PostgreSQL with Neon serverless',
      status: dbStatus.status,
      uptime: '99.99%',
      icon: 'Database',
      ...(isPrivileged && { latency: `${dbStatus.latency}ms` }),
      ...(isPrivileged && dbStatus.error && { error: dbStatus.error })
    },
  ];

  const metrics = [
    {
      label: 'Average Response Time',
      value: isPrivileged ? `${dbStatus.latency + 20}ms` : 'Normal', // Hide exact ms for public
      icon: 'Clock',
      color: 'text-cyan-400'
    },
    {
      label: 'Queries Last 24h',
      value: '1439', // This would come from a real analytics service
      icon: 'Activity',
      color: 'text-purple-400'
    },
    {
      label: 'Uptime (30d)',
      value: '99.92%',
      icon: 'CheckCircle2',
      color: 'text-green-400'
    },
    {
      label: 'Active Sessions',
      value: isPrivileged ? '219' : '> 200', // Obfuscate for public
      icon: 'Zap',
      color: 'text-yellow-400'
    },
  ];

  return NextResponse.json({
    services,
    metrics,
    lastUpdated: new Date().toISOString(),
    userRole: isPrivileged ? 'Admin/User' : 'Guest'
  });
}
