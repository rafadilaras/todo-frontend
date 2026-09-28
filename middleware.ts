import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware (Routing Middleware di sisi Frontend)
 * Berjalan di sisi server Edge sebelum sebuah route / halaman di-render.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Daftar rute otentikasi (khusus guest)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  // Daftar rute yang memerlukan login (Protected Routes)
  const protectedPrefixes = ['/task', '/api-todos', '/cached'];
  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  // 1. Jika belum login tapi mencoba akses protected route -> Redirect ke /login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Jika sudah login tapi membuka halaman login/register -> Redirect ke beranda
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Lanjutkan request dan sisipkan custom header jika dibutuhkan
  const response = NextResponse.next();
  response.headers.set('x-frontend-middleware', 'active');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
