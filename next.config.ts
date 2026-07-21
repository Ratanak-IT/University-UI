import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // next/image blocks external URLs unless the host is allowlisted here.
    // Without this, the avatar images return 400 Bad Request.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;