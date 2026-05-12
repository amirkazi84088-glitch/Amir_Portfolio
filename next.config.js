/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  images: { domains: ['*'], unoptimized: true },
}
module.exports = nextConfig
