import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", 
        hostname: "**", 
        port: "",
        pathname: "/**", 
      },
      {
        protocol: "http", 
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
