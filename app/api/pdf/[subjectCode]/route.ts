import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { subjectCode: string } }
) {
  try {
    const { subjectCode } = params;
    
    // Récupérer le PDF depuis le backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/api/course-pdf/${subjectCode}`);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }
    
    // Récupérer le PDF en ArrayBuffer
    const pdfBuffer = await response.arrayBuffer();
    
    // Retourner le PDF avec les bons headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
    
  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}






