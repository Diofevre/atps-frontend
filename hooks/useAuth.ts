import { useKeycloakAuth } from '@/hooks/useKeycloakAuth';

export function useAuth() {
  const { isAuthenticated, isLoading, user } = useKeycloakAuth();
  
  return {
    isAuthenticated,
    user,
    loading: isLoading,
  };
}
