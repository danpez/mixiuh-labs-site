import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    // Frozen at build time and inlined in server + client bundles, so the
    // prerendered HTML and the hydration render agree on what was released.
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
};

export default nextConfig;
