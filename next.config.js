/** @type {import('next').NextConfig} */
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const nextConfig = {
  reactStrictMode: true,
  // Keep Prisma out of the bundle so native query engines resolve at runtime.
  serverExternalPackages: ["@prisma/client"],
  // Admin CSV import can exceed the default 10MB body buffer used when middleware runs.
  experimental: {
    proxyClientMaxBodySize: "100mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
        port: "",
        pathname: "/**/*",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/300/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "drive.usercontent.google.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "authjs.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "translate.google.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/.prisma/client/**/*"],
    "/*": ["./node_modules/.prisma/client/**/*"],
  },
  async headers() {
    const adminHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Cache-Control", value: "no-store" },
    ];

    return [
      { source: "/admin", headers: adminHeaders },
      { source: "/admin/:path*", headers: adminHeaders },
      {
        source: "/api/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/jlpt/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/member",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/member/:path*",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin/member/:path*",
        destination: "/admin",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
