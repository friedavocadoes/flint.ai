import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* next 16: eslint is no longer run during build — use `npm run lint` separately */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
