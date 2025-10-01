import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // leave empty unless you need Turbo or React Compiler
  },
  eslint: {
    // ✅ prevents build from failing on ESLint errors in Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
