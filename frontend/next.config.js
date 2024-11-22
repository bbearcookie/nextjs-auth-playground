/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false, // 브라우저 환경에서 import async_hooks 제외
      };
    }
    return config;
  },
};

module.exports = nextConfig;
