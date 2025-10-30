/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "standalone",
  serverExternalPackages: ["bull"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
