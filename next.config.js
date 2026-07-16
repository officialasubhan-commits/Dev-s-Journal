// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable rewrites to redirect legacy /courses routes to /academy
  async rewrites() {
    return [
      {
        source: '/courses/:path*',
        destination: '/academy/:path*', // internal rewrite (no redirect)
      },
    ];
  },
  // Optional: Redirect old /courses root to /academy
  async redirects() {
    return [
      {
        source: '/courses',
        destination: '/academy',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
