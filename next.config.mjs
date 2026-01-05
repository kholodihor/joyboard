import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  webpack: (config, { buildId, dev }) => {
    // Optimize cache serialization
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
      cacheDirectory: resolve(__dirname, '.next/cache'),
      store: 'pack',
      name: dev ? 'development' : 'production',
      version: buildId,
      compression: 'gzip',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    };

    return config;
  },
  turbopack: {
    // Empty turbopack config to silence warning
    // We're using webpack for now due to custom cache configuration
  },
};

export default nextConfig;
