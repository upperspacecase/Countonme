/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remotion ships ESM that Next should transpile for Turbopack/webpack compatibility.
  transpilePackages: ['remotion', '@remotion/player'],
};

export default nextConfig;
