import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  modularizeImports: {
    "react-icons": {
      transform: "react-icons/{{member}}",
    },
    zustand: {
      transform: "zustand/{{member}}",
    },
  },
};

export default nextConfig;
