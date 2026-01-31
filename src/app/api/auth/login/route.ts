import { NextRequest, NextResponse } from 'next/server';
import { families } from '@/lib/db/operations';
import { createToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Family code is required' }, { status: 400 });
    }

    // Look up family by code
    const family = await families.getByCode(code);

    if (!family) {
      return NextResponse.json({ error: 'Invalid family code' }, { status: 401 });
    }

    // Create JWT token
    const token = await createToken(family);

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      family: {
        id: family.id,
        name: family.name,
        isAdmin: family.isAdmin,
      },
    });

    // Set HTTP-only cookie for security
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
