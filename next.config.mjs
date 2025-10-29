/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone', // Pour le déploiement Docker optimisé
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