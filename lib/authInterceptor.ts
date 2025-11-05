/**
 * Authentication interceptor for automatic token refresh
 */

import { refreshToken, getTokens, clearAuth } from './keycloakAuth';

let refreshPromise: Promise<void> | null = null;

/**
 * Automatically refresh token if it's about to expire
 * This prevents sudden logouts due to short token lifetimes
 * Refreshes token if it expires within 5 minutes
 */
export async function ensureValidToken(): Promise<boolean> {
  const tokens = getTokens();
  
  if (!tokens) {
    return false;
  }

  // Check if refresh_token is expired
  const now = Date.now();
  if (tokens.refresh_expires_at && tokens.refresh_expires_at < now) {
    // Refresh token is expired, user needs to login again
    console.warn('⚠️ Refresh token expired, clearing auth');
    clearAuth();
    return false;
  }

  // Check if access token is expired or about to expire (within 5 minutes)
  const fiveMinutesFromNow = now + (5 * 60 * 1000);
  
  if (tokens.expires_at < fiveMinutesFromNow) {
    // Token is about to expire or already expired, refresh it
    if (!refreshPromise) {
      refreshPromise = refreshToken().then(() => {
        refreshPromise = null;
      }).catch((error) => {
        console.error('Error refreshing token:', error);
        clearAuth();
        refreshPromise = null;
        throw error; // Re-throw to let caller handle it
      });
    }
    
    try {
      await refreshPromise;
      return true;
    } catch (error) {
      // Refresh failed, user needs to login again
      return false;
    }
  }
  
  return true;
}

/**
 * Fetch wrapper that ensures token is valid before making requests
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Ensure token is valid before making request
  const isValid = await ensureValidToken();
  
  if (!isValid) {
    // Redirect to login if token refresh failed
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Not authenticated - token refresh failed');
  }
  
  const tokens = getTokens();
  
  if (!tokens) {
    throw new Error('Not authenticated');
  }

  // Add authorization header
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${tokens.access_token}`);
  
  return fetch(url, {
    ...options,
    headers,
  });
}

