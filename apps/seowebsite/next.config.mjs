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
  },
  // output: 'export', // Uncomment for static export if needed, but not for API routes
};

export default nextConfig;
