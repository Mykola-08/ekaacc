import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@ekaacc/shared-ui'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
