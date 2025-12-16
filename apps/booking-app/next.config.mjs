/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Fix for client reference manifest issues in Next.js 15
  outputFileTracingIncludes: {
    '/': ['./app/**/*'],
  },
};

export default nextConfig;
