import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from './lib/auth';

export function middleware(request: NextRequest) {
  // Only protect /admin routes (but not /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    // Check for admin token in cookies
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      // No token, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Verify token
    const adminUser = verifyAdminToken(token);
    if (!adminUser) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      const response = NextResponse.redirect(loginUrl);
      
      // Clear invalid cookie
      response.cookies.delete('admin-token');
      return response;
    }
    
    // Valid admin, allow access
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};