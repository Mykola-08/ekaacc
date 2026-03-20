import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
const packageVersion = packageJson.version ?? '0.0.0';

function getGitCommitSha() {
  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return 'nogit';
  }
}

const gitSha = getGitCommitSha();
const appBuildId = `${packageVersion}-${gitSha}`;
const appBuildTimestamp = new Date().toISOString();

// Sanitize env vars — strip accidental surrounding quotes from shell/CI environments
const envKeysToClean = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_API_KEY',
  'NEXT_PUBLIC_APP_URL',
];
for (const key of envKeysToClean) {
  if (process.env[key]) process.env[key] = process.env[key].replace(/^["']|["']$/g, '');
}
// Support both anon key naming conventions
if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  generateBuildId: async () => appBuildId,
  env: {
    NEXT_PUBLIC_APP_VERSION: packageVersion,
    NEXT_PUBLIC_APP_BUILD_ID: appBuildId,
    NEXT_PUBLIC_APP_BUILD_TIMESTAMP: appBuildTimestamp,
    APP_VERSION: packageVersion,
    APP_BUILD_ID: appBuildId,
    APP_BUILD_TIMESTAMP: appBuildTimestamp,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'mocha-cdn.com',
      },
      {
        protocol: 'https',
        hostname: '5tghbndjb61dnqaj.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'front.agenyz.eu',
      },
    ],
    // Optimize image loading
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'recharts', '@headlessui/react', 'motion'],
  },
  // Compression
  compress: true,
  // Powered by header removal for security
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/plans',
        destination: '/finances?tab=plans',
        permanent: true,
      },
      {
        source: '/booking',
        destination: '/book',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ];
  },
};

import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
