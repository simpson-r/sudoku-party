import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@sudokuparty/shared'],

  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
};

export default nextConfig;