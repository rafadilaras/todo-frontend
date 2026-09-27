import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware (Routing Middleware di sisi Frontend)
 * Memproteksi rute aplikasi sesuai status login user.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Daftar rute publik/autentikasi (khusus guest)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  // Daftar rute terproteksi (harus sudah login): Home (/), /task, /api-todos
  const isProtectedRoute =
    pathname === '/' ||
    pathname.startsWith('/task') ||
    pathname.startsWith('/api-todos');

  // 1. Jika belum login tapi mencoba akses rute terproteksi -> Redirect ke /login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Jika sudah login tapi membuka halaman login/register -> Redirect ke beranda (/)
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
