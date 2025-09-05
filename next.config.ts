import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: false, // disable minification so errors are readable
  reactStrictMode: true,
};

export default nextConfig;
