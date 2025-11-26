import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Ensure type checking happens during build
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
