'use client';

import LoginForm from '@/components/auth/LoginForm';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKeycloakAuth } from '@/hooks/useKeycloakAuth';

// Force dynamic rendering to avoid static generation errors
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const { isAuthenticated, isLoading } = useKeycloakAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated gradient background with app colors - Light mode */}
      <div 
        className="absolute inset-0 transition-opacity duration-300 dark:hidden"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(193, 224, 241, 0.4) 0%, 
              rgba(238, 206, 132, 0.15) 50%,
              transparent 100%
            ),
            linear-gradient(135deg, #C1E0F1 60%, #EECE84 100%)
          `,
        }}
      />

      {/* Animated gradient background - Dark mode */}
      <div 
        className="absolute inset-0 transition-opacity duration-300 hidden dark:block"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(30, 41, 59, 0.6) 0%, 
              rgba(15, 23, 42, 0.4) 50%,
              transparent 100%
            ),
            linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background)) 100%)
          `,
        }}
      />

      {/* Animated clouds/particles - Light mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none dark:hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-15"
            style={{
              width: `${150 + Math.random() * 250}px`,
              height: `${150 + Math.random() * 250}px`,
              background: `radial-gradient(circle, rgba(${i % 2 === 0 ? '193,224,241' : '238,206,132'},0.4) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${12 + Math.random() * 8}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Animated clouds/particles - Dark mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden dark:block">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${150 + Math.random() * 250}px`,
              height: `${150 + Math.random() * 250}px`,
              background: `radial-gradient(circle, rgba(${i % 2 === 0 ? '100,116,139' : '150,150,150'},0.3) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${12 + Math.random() * 8}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Glass morphism card - Two column layout */}
      <div className="relative z-10 w-full max-w-5xl mx-4">
        <div 
          className="backdrop-blur-xl bg-white/80 dark:bg-card/90 rounded-3xl shadow-2xl border border-white/50 dark:border-border overflow-hidden transition-all duration-300"
          style={{
            boxShadow: '0 20px 60px rgba(193, 224, 241, 0.4)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Logo and branding */}
            <div className="p-10 flex flex-col justify-center items-center bg-gradient-to-br from-blue-50/50 to-yellow-50/30 dark:from-slate-800/50 dark:to-slate-700/30 transition-colors duration-300">
              <div className="inline-flex items-center justify-center mb-6 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/50 dark:border-border transition-all duration-300" style={{
                boxShadow: '0 8px 20px rgba(193, 224, 241, 0.3)',
              }}>
                <Image
                  src="/atps-logo-v2.png"
                  alt="ATPS Logo"
                  width={120}
                  height={120}
                  className="drop-shadow-lg"
                  priority
                  unoptimized
                />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-center text-foreground transition-colors duration-300">
                Airline Transport Pilot
              </h1>
              <p className="text-base text-center text-text-secondary transition-colors duration-300">Connectez-vous à votre espace de formation</p>
              <p className="text-sm text-center mt-4 max-w-xs text-text-secondary transition-colors duration-300">
                Access your personalized training dashboard and continue your aviation journey
              </p>
            </div>

            {/* Right side - Form */}
            <div className="p-10 bg-white/50 dark:bg-card/50 transition-colors duration-300">
              <LoginForm redirectTo="/dashboard" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-text-secondary transition-colors duration-300">
          <p>© 2024 Airline Transport Pilot School</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
}
