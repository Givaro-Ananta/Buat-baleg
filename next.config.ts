import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images from Google profile pictures
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
  // Increase body size limit for file uploads (default 4MB, we need up to 25MB per file × n files)
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

export default nextConfig;
