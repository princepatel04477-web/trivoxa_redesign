import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 425, 640, 768, 828, 1024, 1440, 1920],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ['motion', '@react-three/drei', 'lucide-react'],
  },
};

export default nextConfig;
