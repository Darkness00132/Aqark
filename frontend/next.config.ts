import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  compiler: { removeConsole: process.env.NODE_ENV === "production" },
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "aqark-s3.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  modularizeImports: {
    "react-icons": {
      transform: "react-icons/{{member}}",
    },
  },
};

export default nextConfig;
