import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes
    const publicPaths = ['/login', '/api/', '/_next/', '/favicon.ico'];
    if (publicPaths.some(p => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    // auth_token Cookie で認証チェック
    const authToken = request.cookies.get('auth_token')?.value;

    if (!authToken) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    // Vercel Edge Runtime 対応: static assets を除外
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
