import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, family: null });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      // Token is invalid or expired - clear the cookie
      const response = NextResponse.json({ authenticated: false, family: null });
      response.cookies.set(AUTH_COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      return response;
    }

    return NextResponse.json({
      authenticated: true,
      family: {
        id: payload.familyId,
        name: payload.familyName,
        isAdmin: payload.isAdmin,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false, family: null });
  }
}
