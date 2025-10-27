import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the access token from cookies
    const cookies = request.cookies;
    let token: string | null = null;
    
    // Try to get token from cookies
    const tokensCookie = cookies.get('keycloak_tokens');
    if (tokensCookie) {
      try {
        const tokens = JSON.parse(tokensCookie.value);
        token = tokens.access_token;
      } catch (e) {
        console.error('Error parsing tokens cookie:', e);
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the backend URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // Forward the request to the backend with authentication
    const response = await fetch(`${backendUrl}/api/tests/resumeTest`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Resume test API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
