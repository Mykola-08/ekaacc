import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Ensure type checking happens during build
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
