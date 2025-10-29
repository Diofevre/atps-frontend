// Import nécessaire
import React from 'react';
import { useKeycloakAuth } from '@/hooks/useKeycloakAuth';

// Compatibility layer: redirect old useAuth to new useKeycloakAuth
export { useKeycloakAuth as useAuth } from '@/hooks/useKeycloakAuth';

// Export useUser hook (compatibility avec Clerk)
export function useUser() {
  const { user } = useKeycloakAuth();
  return { user, isLoaded: !!user };
}

// Export UserButton pour compatibilité (peut être un composant vide)
export function UserButton({ afterSwitchSessionUrl, ...props }: { afterSwitchSessionUrl?: string; [key: string]: any }) {
  return null;
}

// Export SignedIn pour compatibilité
export function SignedIn({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useKeycloakAuth();
  return isAuthenticated ? React.createElement(React.Fragment, null, children) : null;
}

// Export SignedOut pour compatibilité
export function SignedOut({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useKeycloakAuth();
  return !isAuthenticated ? React.createElement(React.Fragment, null, children) : null;
}

// Export SignInButton pour compatibilité
export function SignInButton({ children, mode, ...props }: { children?: React.ReactNode; mode?: string; [key: string]: any }) {
  return React.createElement('a', { href: '/login', ...props }, children || 'Sign In');
}
