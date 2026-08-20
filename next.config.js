/** @type {import('next').NextConfig} */
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const nextConfig = {
  reactStrictMode: true,
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
