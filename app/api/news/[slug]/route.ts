export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
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
      `${process.env.BACKEND_URL}/api/news/${params.slug}`,
      {
        headers,
      }
    );

    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching article:', error);
    return Response.json(
      { success: false, message: 'Error fetching article' },
      { status: 500 }
    );
  }
}
