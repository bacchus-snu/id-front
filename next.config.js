/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/sign-up',
        destination: '/signup',
        permanent: false,
      },
      {
        source: '/verify',
        destination: '/signup',
        permanent: false,
      },
      {
        source: '/my-page',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
