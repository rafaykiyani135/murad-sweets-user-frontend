import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep native sharp out of the bundler so image conversion does not fall back
  // to the wasm runtime (SharedArrayBuffer-backed Buffers).
  serverExternalPackages: ['sharp'],
  images: {
    localPatterns: [
      {
        pathname: '/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'items-images-production-f.squarecdn.com',
      },
      {
        // Supabase Storage public bucket (product images uploaded from the admin portal)
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
