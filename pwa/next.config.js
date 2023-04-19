/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['components', 'contexts', 'helpers', 'hooks', 'interfaces', 'pages', 'resources', 'utils'],
  },
  externals: {
    'ckeditor': 'window.CKEDITOR',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
}

module.exports = nextConfig
