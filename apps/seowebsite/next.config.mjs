/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com', 
      'images.pexels.com', 
      'mocha-cdn.com', 
      '5tghbndjb61dnqaj.public.blob.vercel-storage.com'
    ],
  },
  // output: 'export', // Uncomment for static export if needed, but not for API routes
};

export default nextConfig;
