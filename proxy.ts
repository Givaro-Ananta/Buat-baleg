import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const PROTECTED_ROUTES = ['/pengawas', '/admin'];
// Routes only for Master Admin
const ADMIN_ONLY_ROUTES = ['/admin'];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes — allow through
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Get JWT token (works in edge runtime)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Login page: if already logged in redirect away
  if (pathname === '/login') {
    if (token) {
      const role = token.role as string;
      const dest = role === 'Master Admin' ? '/admin' : '/pengawas';
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  // Protected routes — must be authenticated
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only routes — must be Master Admin
  const isAdminOnly = ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));
  if (isAdminOnly && token?.role !== 'Master Admin') {
    return NextResponse.redirect(new URL('/pengawas', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
