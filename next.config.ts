import type { NextConfig } from 'next';

import path from 'path';

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer }) => {
    // Optimize cache serialization with unique names for different compilers
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [path.resolve(process.cwd(), 'next.config.ts')],
      },
      cacheDirectory: path.resolve(process.cwd(), '.next/cache'),
      store: 'pack',
      name: dev
        ? `${isServer ? (config.name === 'edge-server' ? 'edge-server' : 'server') : 'client'}-development`
        : `${isServer ? (config.name === 'edge-server' ? 'edge-server' : 'server') : 'client'}-production`,
      version: buildId,
      compression: 'gzip',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    };

    return config;
  },
  experimental: {
    turbo: {}, // Enable Turbopack with default optimizations
  },
};

export default nextConfig;
