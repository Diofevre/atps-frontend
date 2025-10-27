export async function GET(request: Request) {
  try {
    // Get authorization header from request
    const authHeader = request.headers.get('authorization');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/news/featured`,
      {
        headers,
      }
    );

    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching featured article:', error);
    return Response.json(
      { success: false, message: 'Error fetching featured article' },
      { status: 500 }
    );
  }
}
