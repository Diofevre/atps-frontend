/**
 * Authentication interceptor for automatic token refresh
 */

import { refreshToken, getTokens, clearAuth } from './keycloakAuth';

let refreshPromise: Promise<void> | null = null;

/**
 * Automatically refresh token if it's about to expire
 * This prevents sudden logouts due to short token lifetimes
 */
export async function ensureValidToken(): Promise<boolean> {
  const tokens = getTokens();
  
  if (!tokens) {
    return false;
  }

  // Check if token expires within the next 5 minutes
  const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
  
  if (tokens.expires_at < fiveMinutesFromNow) {
    // Token is about to expire, refresh it
    if (!refreshPromise) {
      refreshPromise = refreshToken().then(() => {
        refreshPromise = null;
      }).catch((error) => {
        console.error('Error refreshing token:', error);
        clearAuth();
        refreshPromise = null;
      });
    }
    
    await refreshPromise;
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
  await ensureValidToken();
  
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

