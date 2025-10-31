export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';

    // Get authorization header from request
    const authHeader = request.headers.get('authorization');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/news?page=${page}&limit=${limit}`,
      {
        headers,
      }
    );

    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return Response.json(
      { success: false, message: 'Error fetching news' },
      { status: 500 }
    );
  }
}
