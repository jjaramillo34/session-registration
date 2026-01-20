import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function middleware(request: NextRequest) {
  try {
    // Only protect admin routes (except login)
    if (request.nextUrl.pathname.startsWith('/admin') && 
        !request.nextUrl.pathname.startsWith('/admin/login')) {
      
      const token = request.cookies.get('admin-token')?.value;

      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      try {
        await jwtVerify(token, JWT_SECRET);
        // Token is valid, allow access
        return NextResponse.next();
      } catch (error) {
        // Token is invalid, redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('admin-token');
        return response;
      }
    }

    return NextResponse.next();
  } catch (error) {
    // If middleware itself fails, log and allow request (fail open)
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
