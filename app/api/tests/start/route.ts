import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCookie } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get the access token from cookies
    const cookies = request.cookies;
    let token: string | null = null;
    
    // Try to get token from cookies
    const tokensCookie = cookies.get('keycloak_tokens');
    if (tokensCookie) {
      const tokens = getTokensFromCookie(tokensCookie.value);
      if (tokens) {
        token = tokens.access_token;
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();

    // Get the backend URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    // Forward the request to the backend with authentication
    const response = await fetch(`${backendUrl}/api/tests/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Tests start API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
