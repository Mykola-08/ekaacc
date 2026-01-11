import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@ekaacc/shared-ui'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Enable optimizations
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  // Improve caching and performance
  headers: async () => [
    {
      // Cache static assets for 1 year
      source: '/favicon.ico',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      // Cache API responses appropriately
      source: '/api/services',
      headers: [
        { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
      ],
    },
    {
      source: '/api/services/:id',
      headers: [
        { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
      ],
    },
  ],
  // Bundle analyzer in dev (run with ANALYZE=true)
  ...(process.env.ANALYZE === 'true' && {
    productionBrowserSourceMaps: true,
  }),
};

export default nextConfig;
