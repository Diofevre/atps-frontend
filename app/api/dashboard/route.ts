import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Client-side auth: This API route cannot access cookies set by document.cookie
 * The fetch from the client should include the token in the headers
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header (set by client-side fetch)
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Get the backend URL from environment (use internal Docker network)
    const backendUrl = process.env.BACKEND_URL || 'http://myatps-backend:3000';
    
    // Forward the request to the backend with authentication
    const response = await fetch(`${backendUrl}/api/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

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