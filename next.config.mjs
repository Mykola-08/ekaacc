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
    ],
    // Optimize image loading
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
  },
  // Bundle optimization
  experimental: {
    cacheComponents: true,
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  // Compression
  compress: true,
  // Powered by header removal for security
  poweredByHeader: false,
};

export default nextConfig;
