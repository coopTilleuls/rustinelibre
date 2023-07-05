const withPWA = require('next-pwa')({
  dest: 'public',
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
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
