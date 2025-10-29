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
    // Utiliser l'URL du backend depuis les variables d'environnement
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://myatps-backend:3000';
    
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