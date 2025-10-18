import { NextResponse } from 'next/server'

// Mock middleware - allows all routes for development
export function middleware(request: any) {
  // Add mock user headers for development
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-mock-user-id', 'mock-user-dev-123')
  requestHeaders.set('x-mock-user-email', 'test@atps.com')
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}