import type { NextConfig } from "next";
//@ts-ignore
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "physiverse.fly.storage.tigris.dev",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
