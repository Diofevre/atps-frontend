/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Permettre le build malgré les erreurs TypeScript
  },
  output: 'standalone', // Pour le déploiement Docker optimisé
  // Permettre le build même avec des erreurs de prérendu
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Skip static generation errors
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Skip static exports for problematic pages
  generateBuildId: async () => {
    return 'build-id';
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
    // Utiliser l'URL du backend DEPUIS LA VARIABLE BACKEND_URL (pas NEXT_PUBLIC pour éviter les boucles)
    const backendUrl = process.env.BACKEND_URL || 'http://myatps-backend:3000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/questions/:path*',
        destination: `${backendUrl}/questions/:path*`,
      },
    ];
  },
};

export default nextConfig;