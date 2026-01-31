/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createToken, verifyToken, getTokenFromCookies, AUTH_COOKIE_NAME } from './jwt';
import type { Family } from '@/types';

// Mock family for testing
const mockFamily: Family = {
  id: 'family-123',
  name: 'Smith',
  code: 'SMITH2024',
  members: ['John', 'Jane'],
  isAdmin: false,
  createdAt: '2024-01-01T00:00:00Z',
};

const mockAdminFamily: Family = {
  ...mockFamily,
  id: 'admin-123',
  name: 'Admin',
  code: 'ADMIN2024',
  isAdmin: true,
};

describe('JWT Utilities', () => {
  const originalEnv = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-for-testing-only';
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.JWT_SECRET = originalEnv;
    } else {
      delete process.env.JWT_SECRET;
    }
  });

  describe('createToken', () => {
    it('should create a valid JWT token', async () => {
      const token = await createToken(mockFamily);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include family data in token', async () => {
      const token = await createToken(mockFamily);
      const payload = await verifyToken(token);

      expect(payload).not.toBeNull();
      expect(payload?.familyId).toBe(mockFamily.id);
      expect(payload?.familyName).toBe(mockFamily.name);
      expect(payload?.isAdmin).toBe(false);
    });

    it('should include admin flag for admin families', async () => {
      const token = await createToken(mockAdminFamily);
      const payload = await verifyToken(token);

      expect(payload?.isAdmin).toBe(true);
    });

    it('should include iat and exp timestamps', async () => {
      const token = await createToken(mockFamily);
      const payload = await verifyToken(token);

      expect(payload?.iat).toBeDefined();
      expect(payload?.exp).toBeDefined();
      expect(payload!.exp).toBeGreaterThan(payload!.iat);
    });
  });

  describe('verifyToken', () => {
    it('should return payload for valid token', async () => {
      const token = await createToken(mockFamily);
      const payload = await verifyToken(token);

      expect(payload).not.toBeNull();
      expect(payload?.familyId).toBe(mockFamily.id);
    });

    it('should return null for invalid token', async () => {
      const payload = await verifyToken('invalid-token');

      expect(payload).toBeNull();
    });

    it('should return null for empty token', async () => {
      const payload = await verifyToken('');

      expect(payload).toBeNull();
    });

    it('should return null for tampered token', async () => {
      const token = await createToken(mockFamily);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';
      const payload = await verifyToken(tamperedToken);

      expect(payload).toBeNull();
    });
  });

  describe('getTokenFromCookies', () => {
    it('should extract token from cookie header', () => {
      const cookieHeader = `${AUTH_COOKIE_NAME}=mytoken123; other=value`;
      const token = getTokenFromCookies(cookieHeader);

      expect(token).toBe('mytoken123');
    });

    it('should return null for missing cookie', () => {
      const cookieHeader = 'other=value; another=thing';
      const token = getTokenFromCookies(cookieHeader);

      expect(token).toBeNull();
    });

    it('should return null for null cookie header', () => {
      const token = getTokenFromCookies(null);

      expect(token).toBeNull();
    });

    it('should handle cookie header with only auth cookie', () => {
      const cookieHeader = `${AUTH_COOKIE_NAME}=singletoken`;
      const token = getTokenFromCookies(cookieHeader);

      expect(token).toBe('singletoken');
    });

    it('should handle cookie with spaces around values', () => {
      const cookieHeader = `other=val;  ${AUTH_COOKIE_NAME}=mytoken  ; another=x`;
      const token = getTokenFromCookies(cookieHeader);

      expect(token).toBe('mytoken');
    });
  });

  describe('AUTH_COOKIE_NAME', () => {
    it('should be a non-empty string', () => {
      expect(AUTH_COOKIE_NAME).toBeDefined();
      expect(typeof AUTH_COOKIE_NAME).toBe('string');
      expect(AUTH_COOKIE_NAME.length).toBeGreaterThan(0);
    });
  });
});
