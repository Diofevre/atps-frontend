import { authEndpoints } from './keycloakConfig';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
    user?: any;
  };
  error?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  expires_at: number;
}

/**
 * Login with username and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(authEndpoints.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.success && data.data) {
      // Calculate expiry timestamp
      const expiresAt = Date.now() + data.data.expires_in * 1000;
      
      // Store tokens in localStorage and cookies
      const tokens: AuthTokens = {
        ...data.data,
        expires_at: expiresAt,
      };
      
      localStorage.setItem('keycloak_tokens', JSON.stringify(tokens));
      localStorage.setItem('keycloak_user', JSON.stringify(data.data.user));
      
      // Store in cookie for middleware access (properly encoded for JSON)
      const encodedTokens = encodeURIComponent(JSON.stringify(tokens));
      const isSecure = window.location.protocol === 'https:';
      document.cookie = `keycloak_tokens=${encodedTokens}; path=/; max-age=${data.data.expires_in}; SameSite=Lax${isSecure ? '; Secure' : ''};`;
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Erreur de connexion',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<AuthResponse> {
  try {
    const tokens = getTokens();
    
    if (!tokens) {
      // Already logged out
      clearAuth();
      return {
        success: true,
        message: 'Déconnexion réussie',
      };
    }

    const response = await fetch(authEndpoints.logout, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: tokens.refresh_token,
      }),
    });

    const data = await response.json();
    
    // Clear tokens regardless of response
    clearAuth();

    return data;
  } catch (error) {
    console.error('Logout error:', error);
    // Clear tokens even on error
    clearAuth();
    return {
      success: false,
      message: 'Erreur de déconnexion',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<AuthResponse> {
  try {
    const tokens = getTokens();
    
    if (!tokens) {
      return {
        success: false,
        message: 'Aucun token trouvé',
      };
    }

    const response = await fetch(authEndpoints.refresh, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: tokens.refresh_token,
      }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      // Update tokens in localStorage and cookies
      const expiresAt = Date.now() + data.data.expires_in * 1000;
      const newTokens: AuthTokens = {
        ...data.data,
        expires_at: expiresAt,
      };
      
      localStorage.setItem('keycloak_tokens', JSON.stringify(newTokens));
      
      // Update cookie
      const encodedTokens = encodeURIComponent(JSON.stringify(newTokens));
      const isSecure = window.location.protocol === 'https:';
      document.cookie = `keycloak_tokens=${encodedTokens}; path=/; max-age=${data.data.expires_in}; SameSite=Lax${isSecure ? '; Secure' : ''};`;
    }

    return data;
  } catch (error) {
    console.error('Refresh token error:', error);
    return {
      success: false,
      message: 'Erreur de rafraîchissement du token',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser(): Promise<any> {
  try {
    const tokens = getTokens();
    
    if (!tokens) {
      return null;
    }

    const response = await fetch(authEndpoints.me, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Get user info error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const tokens = getTokens();
  
  if (!tokens) {
    return false;
  }

  // Check if token is expired
  const now = Date.now();
  if (tokens.expires_at < now) {
    // Token expired, try to refresh
    return false;
  }

  return true;
}

/**
 * Get stored tokens
 */
export function getTokens(): AuthTokens | null {
  try {
    const tokensStr = localStorage.getItem('keycloak_tokens');
    if (!tokensStr) {
      return null;
    }
    
    const tokens: AuthTokens = JSON.parse(tokensStr);
    
    // Check if token is expired
    if (tokens.expires_at < Date.now()) {
      // Token expired
      return null;
    }
    
    return tokens;
  } catch (error) {
    console.error('Error getting tokens:', error);
    return null;
  }
}

/**
 * Get current user from localStorage
 */
export function getUser(): any | null {
  try {
    const userStr = localStorage.getItem('keycloak_user');
    if (!userStr) {
      return null;
    }
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Get access token
 */
export function getAccessToken(): string | null {
  const tokens = getTokens();
  return tokens?.access_token || null;
}

/**
 * Clear authentication data
 */
export function clearAuth(): void {
  localStorage.removeItem('keycloak_tokens');
  localStorage.removeItem('keycloak_user');
  
  // Clear cookie
  document.cookie = 'keycloak_tokens=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
}
