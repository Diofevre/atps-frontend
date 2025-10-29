'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  isAuthenticated, 
  getAccessToken, 
  getUser, 
  logout as logoutKeycloak 
} from '@/lib/keycloakAuth';

interface KeycloakUser {
  email?: string;
  name?: string;
  username?: string;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: KeycloakUser | null;
  token: string | null;
}

export function useKeycloakAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,
  });

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const token = getAccessToken();
      const user = getUser();

      setAuthState({
        isAuthenticated: authenticated,
        isLoading: false,
        user: user as KeycloakUser | null,
        token,
      });
    };

    checkAuth();
    
    // Check auth state every 5 seconds
    const interval = setInterval(checkAuth, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    return getAccessToken();
  }, []);

  const logout = useCallback(async () => {
    await logoutKeycloak();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
    });
  }, []);

  return {
    ...authState,
    getToken,
    getAccessToken: getToken,
    logout,
  };
}
