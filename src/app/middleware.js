// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  // Get the pathname of the request
  const path = req.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(path);

  try {
    // Check if the user is authenticated with secure options
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
      cookieName: 'next-auth.session-token' // Make sure this matches what NextAuth uses
    });
    
    // Check if token exists AND is not expired
    const isAuthenticated = !!token;
    
    console.log(`Path: ${path}, Authenticated: ${isAuthenticated}, Token:`, token ? 'Present' : 'None');

    // Redirect logic
    if (isPublicPath && isAuthenticated) {
      // If user is logged in and tries to access login/register, redirect based on role
      if (token.role === 'shopkeeper') {
        return NextResponse.redirect(new URL(`/shopkeeper-dashboard?userID=${token.id}`, req.url));
      } else {
        return NextResponse.redirect(new URL(`/employee-dashboard?userID=${token.id}`, req.url));
      }
    }
    
    if (!isPublicPath && !isAuthenticated) {
      // If user is not logged in and tries to access protected routes, redirect to login
      console.log(`Redirecting unauthenticated user from ${path} to /login`);
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware authentication error:', error);
    // On error, redirect to login for safety
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    '/login',
    '/register',
    '/employee-dashboard/:path*',
    '/shopkeeper-dashboard/:path*',
    '/dashboard',
    '/transition'
  ]
};