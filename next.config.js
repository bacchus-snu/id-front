/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: new URL('api', process.env.API_BASE).toString() + '/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
