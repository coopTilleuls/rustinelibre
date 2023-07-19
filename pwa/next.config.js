const withPWA = require('next-pwa')({
  dest: 'public',
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [
      'components',
      'contexts',
      'helpers',
      'hooks',
      'interfaces',
      'pages',
      'resources',
      'utils',
      'config',
    ],
  },
});

module.exports = nextConfig;
