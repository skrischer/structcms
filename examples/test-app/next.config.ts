import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@structcms/core', '@structcms/api', '@structcms/admin'],
  webpack: (config) => {
    config.resolve.conditionNames = ['source', ...(config.resolve.conditionNames ?? ['...'])];
    return config;
  },
};

export default nextConfig;
