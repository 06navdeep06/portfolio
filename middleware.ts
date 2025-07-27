import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/'];
const adminPaths = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));
  const isAdminPath = adminPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));
  const authToken = request.cookies.get('auth-token')?.value;
  
  // In a real app, verify the token with your authentication service
  const isAuthenticated = !!authToken;

  // Allow public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Handle admin routes
  if (isAdminPath) {
    if (!isAuthenticated) {
      // Redirect to login with redirect back to admin after login
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Default: allow access
  return NextResponse.next();

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
