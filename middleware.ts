import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/courses(.*)',
  '/questions-bank(.*)',
  '/community(.*)',
  '/atc-simulator(.*)',
  '/news(.*)',
  '/settings(.*)',
  '/user-profile(.*)'
])

// Define public routes that should be accessible without authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/login(.*)',
  '/signup(.*)',
  '/about-atps(.*)',
  '/articles(.*)',
  '/blog(.*)',
  '/faqs(.*)',
  '/latest_news(.*)',
  '/pricing(.*)',
  '/admin-login(.*)'
])

export default clerkMiddleware((auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    auth().protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
}