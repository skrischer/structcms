import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@structcms/core', '@structcms/api', '@structcms/admin'],
};

export default nextConfig;
