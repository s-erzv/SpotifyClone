import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "heheascvjdadslscqwby.supabase.co",
      },
    ],
  },
};

export default nextConfig;
