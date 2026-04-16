/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['remotion', '@remotion/player'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
