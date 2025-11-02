import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCookie } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('[Dashboard API] Request received');
    
    // Get the access token from cookies
    const cookies = request.cookies;
    let token: string | null = null;
    
    // Try to get token from cookies
    const tokensCookie = cookies.get('keycloak_tokens');
    console.log('[Dashboard API] Cookie found:', !!tokensCookie);
    
    if (tokensCookie) {
      const tokens = getTokensFromCookie(tokensCookie.value);
      if (tokens) {
        token = tokens.access_token;
        console.log('[Dashboard API] Token extracted:', !!token);
      }
    }
    
    if (!token) {
      console.log('[Dashboard API] No token found - returning 401');
      console.log('[Dashboard API] All cookies:', Array.from(cookies.getAll()).map(c => ({ name: c.name, hasValue: !!c.value })));
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the backend URL from environment (use internal Docker network)
    const backendUrl = process.env.BACKEND_URL || 'http://myatps-backend:3000';
    console.log('[Dashboard API] Calling backend:', backendUrl);
    console.log('[Dashboard API] Token length:', token.length);
    
    // Forward the request to the backend with authentication
    const response = await fetch(`${backendUrl}/api/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('[Dashboard API] Backend response status:', response.status);

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Dashboard API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 