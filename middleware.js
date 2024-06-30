import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.SECRET });
    const { pathname } = req.nextUrl;
    const protectedPaths = ['/', '/builderprofile', 'editinfo'];

    if (typeof window !== 'undefined') {
        const masterkey = localStorage.getItem('masterkey');
    }

    if (token && pathname === '/login') {
        console.log('Token found, redirecting');
        return NextResponse.redirect(new URL('/surveymodule', req.url));
    }

    if (!token && (protectedPaths.includes(pathname) || pathname.startsWith('/surveymodule'))) {
        console.log('No token found, redirecting');
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/builderprofile', '/editinfo', '/surveymodule', '/surveymodule/:path*'],
}