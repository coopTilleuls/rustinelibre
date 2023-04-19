/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['components', 'contexts', 'helpers', 'hooks', 'interfaces', 'pages', 'resources', 'utils'],
  }
}

module.exports = nextConfig
