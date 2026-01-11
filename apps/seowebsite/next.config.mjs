/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    optimizePackageImports: ['lucide-react', 'date-fns', '@supabase/supabase-js'],
  },
  // Compression
  compress: true,
  // Powered by header removal for security
  poweredByHeader: false,
};

export default nextConfig;
