/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'illustrations.popsy.co',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/questions/:path*',
        destination: 'http://localhost:8000/questions/:path*',
      },
    ];
  },
};

export default nextConfig;