import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/users/me called');
    
    // Récupérer le token depuis le header Authorization
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No valid authorization header');
      return NextResponse.json(
        { error: 'No authorization token' },
        { status: 401 }
      );
    }
    
    // Extraire le token
    const accessToken = authHeader.substring(7);
    console.log('✅ Token extracted, length:', accessToken.length);
    
    // Appeler le backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log('📡 Calling backend:', `${backendUrl}/api/users/me`);
    
    const response = await fetch(`${backendUrl}/api/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📥 Backend response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Backend error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch user data from backend' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ User data fetched successfully');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Error in /api/users/me:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
