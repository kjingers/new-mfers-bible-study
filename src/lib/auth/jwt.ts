import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import type { Family, AuthPayload } from '@/types';

// Get JWT secret from environment, with fallback for development
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production');
    }
    // Development fallback - should not be used in production
    return new TextEncoder().encode('dev-secret-do-not-use-in-production');
  }
  return new TextEncoder().encode(secret);
}

// Token expiration time (7 days)
const TOKEN_EXPIRATION = '7d';

// Cookie name for the auth token
export const AUTH_COOKIE_NAME = 'bible-study-auth';

/**
 * Create a JWT token for a family
 */
export async function createToken(family: Family): Promise<string> {
  const secret = getJwtSecret();

  const token = await new SignJWT({
    familyId: family.id,
    familyName: family.name,
    isAdmin: family.isAdmin,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(secret);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);

    // Validate required fields
    if (!payload.familyId || !payload.familyName) {
      return null;
    }

    return {
      familyId: payload.familyId as string,
      familyName: payload.familyName as string,
      isAdmin: (payload.isAdmin as boolean) || false,
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(payload: JWTPayload): boolean {
  if (!payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

/**
 * Get token from cookie header string
 */
export function getTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>
  );

  return cookies[AUTH_COOKIE_NAME] || null;
}
