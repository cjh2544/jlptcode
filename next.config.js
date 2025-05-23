/** @type {import('next').NextConfig} */
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first")

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
        port: '',
        pathname: '/**/*',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/300/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'authjs.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'translate.google.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  output: 'standalone',
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/jlpt/:path*',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
