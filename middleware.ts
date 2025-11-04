import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/admin-login',
  '/sign-in',
  '/sign-up',
  '/api/auth',
];

// Admin routes
const adminRoutes = [
  '/administrateur',
  '/admin',
];

// Client routes (require authentication but not admin)
const protectedRoutes = [
  '/dashboard',
  '/courses',
  '/questions-bank',
  '/community',
  '/atc-simulator',
  '/news', // News require authentication
  '/blog', // Blog require authentication
  '/settings',
  '/user-profile',
  '/account',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute || isAdminRoute) {
    // Get token from cookie
    const tokenCookie = request.cookies.get('keycloak_tokens')?.value;
    
    if (!tokenCookie) {
      // No token, redirect to login immediately
      console.log(`🔒 No token found for protected route: ${pathname}`);
      const redirectUrl = isAdminRoute 
        ? new URL('/admin-login', request.url)
        : new URL('/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Try to parse and validate the token
    try {
      const decodedCookie = decodeURIComponent(tokenCookie);
      const tokens = JSON.parse(decodedCookie);
      
      // Check if token is expired (with 10 minute tolerance for automatic refresh)
      // The client-side refresh will handle tokens that expire within 5 minutes
      // This tolerance prevents race conditions where middleware checks before refresh completes
      const now = Date.now();
      const tenMinutesAgo = now - (10 * 60 * 1000);
      
      if (tokens.expires_at && tokens.expires_at < tenMinutesAgo) {
        // Token expired more than 10 minutes ago, redirect to login
        // (Allows time for automatic refresh to work on client side)
        console.log(`🔒 Token expired for route: ${pathname}`);
        const redirectUrl = isAdminRoute 
          ? new URL('/admin-login', request.url)
          : new URL('/login', request.url);
        const response = NextResponse.redirect(redirectUrl);
        
        // Clear expired token cookie
        response.cookies.delete('keycloak_tokens');
        response.cookies.delete('keycloak_user');
        
        return response;
      }
      
      // Token is valid, allow access
      return NextResponse.next();
    } catch (error) {
      // Invalid token format, redirect to login
      console.error(`🔒 Invalid token format for route: ${pathname}`, error);
      
      const redirectUrl = isAdminRoute 
        ? new URL('/admin-login', request.url)
        : new URL('/login', request.url);
      const response = NextResponse.redirect(redirectUrl);
      
      // Clear invalid token cookie
      response.cookies.delete('keycloak_tokens');
      response.cookies.delete('keycloak_user');
      
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};