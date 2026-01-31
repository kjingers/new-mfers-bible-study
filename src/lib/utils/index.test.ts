import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  cn,
  getNextTuesday,
  isTuesday,
  formatDate,
  toISODateString,
  parseISODate,
  isSameDay,
  isPast,
  isToday,
  generateCode,
  isValidCodeFormat,
} from './index';

describe('cn (class name merger)', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'included', false && 'excluded')).toBe('base included');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});

describe('getNextTuesday', () => {
  it('returns the same day if today is Tuesday', () => {
    // January 7, 2025 is a Tuesday
    const tuesday = new Date(2025, 0, 7, 10, 30);
    const result = getNextTuesday(tuesday);
    expect(result.getDay()).toBe(2);
    expect(result.getDate()).toBe(7);
  });

  it('returns next Tuesday if today is Wednesday', () => {
    // January 8, 2025 is a Wednesday
    const wednesday = new Date(2025, 0, 8, 10, 30);
    const result = getNextTuesday(wednesday);
    expect(result.getDay()).toBe(2);
    expect(result.getDate()).toBe(14); // Next Tuesday
  });

  it('returns next Tuesday if today is Monday', () => {
    // January 6, 2025 is a Monday
    const monday = new Date(2025, 0, 6, 10, 30);
    const result = getNextTuesday(monday);
    expect(result.getDay()).toBe(2);
    expect(result.getDate()).toBe(7); // Tomorrow
  });

  it('returns next Tuesday if today is Sunday', () => {
    // January 5, 2025 is a Sunday
    const sunday = new Date(2025, 0, 5, 10, 30);
    const result = getNextTuesday(sunday);
    expect(result.getDay()).toBe(2);
    expect(result.getDate()).toBe(7);
  });

  it('resets time to midnight', () => {
    const date = new Date(2025, 0, 6, 15, 45, 30);
    const result = getNextTuesday(date);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });
});

describe('isTuesday', () => {
  it('returns true for Tuesday', () => {
    expect(isTuesday(new Date(2025, 0, 7))).toBe(true);
  });

  it('returns false for other days', () => {
    expect(isTuesday(new Date(2025, 0, 6))).toBe(false); // Monday
    expect(isTuesday(new Date(2025, 0, 8))).toBe(false); // Wednesday
  });
});

describe('formatDate', () => {
  it('formats date with default options', () => {
    const date = new Date(2025, 0, 7);
    const result = formatDate(date);
    expect(result).toMatch(/Tue/);
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/7/);
  });

  it('accepts string dates', () => {
    const result = formatDate('2025-01-07');
    expect(result).toMatch(/Tue/);
  });

  it('accepts custom options', () => {
    const date = new Date(2025, 0, 7);
    const result = formatDate(date, { weekday: 'long' });
    expect(result).toMatch(/Tuesday/);
  });
});

describe('toISODateString', () => {
  it('converts date to ISO date string', () => {
    const date = new Date(2025, 0, 7);
    expect(toISODateString(date)).toBe('2025-01-07');
  });
});

describe('parseISODate', () => {
  it('parses ISO date string to Date', () => {
    const result = parseISODate('2025-01-07');
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getDate()).toBe(7);
  });
});

describe('isSameDay', () => {
  it('returns true for same day', () => {
    const a = new Date(2025, 0, 7, 10, 30);
    const b = new Date(2025, 0, 7, 15, 45);
    expect(isSameDay(a, b)).toBe(true);
  });

  it('returns false for different days', () => {
    const a = new Date(2025, 0, 7);
    const b = new Date(2025, 0, 8);
    expect(isSameDay(a, b)).toBe(false);
  });

  it('accepts string dates', () => {
    expect(isSameDay('2025-01-07', '2025-01-07')).toBe(true);
    expect(isSameDay('2025-01-07', '2025-01-08')).toBe(false);
  });
});

describe('isPast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 0, 15)); // January 15, 2025
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for past dates', () => {
    expect(isPast(new Date(2025, 0, 10))).toBe(true);
    expect(isPast('2025-01-10')).toBe(true);
  });

  it('returns false for today', () => {
    expect(isPast(new Date(2025, 0, 15))).toBe(false);
  });

  it('returns false for future dates', () => {
    expect(isPast(new Date(2025, 0, 20))).toBe(false);
  });
});

describe('isToday', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 0, 15, 12, 30)); // January 15, 2025 at noon
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for today', () => {
    expect(isToday(new Date(2025, 0, 15))).toBe(true);
    expect(isToday(new Date(2025, 0, 15, 8, 0))).toBe(true);
  });

  it('returns false for other days', () => {
    expect(isToday(new Date(2025, 0, 14))).toBe(false);
    expect(isToday(new Date(2025, 0, 16))).toBe(false);
  });
});

describe('generateCode', () => {
  it('generates a 6-character code', () => {
    const code = generateCode();
    expect(code).toHaveLength(6);
  });

  it('only uses alphanumeric characters', () => {
    const code = generateCode();
    expect(code).toMatch(/^[A-Z0-9]{6}$/);
  });

  it('generates different codes', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) {
      codes.add(generateCode());
    }
    // Should have many unique codes (not all will be unique due to randomness)
    expect(codes.size).toBeGreaterThan(90);
  });
});

describe('isValidCodeFormat', () => {
  it('returns true for valid codes', () => {
    expect(isValidCodeFormat('ABC123')).toBe(true);
    expect(isValidCodeFormat('XXXXXX')).toBe(true);
    expect(isValidCodeFormat('000000')).toBe(true);
  });

  it('returns true for lowercase (case insensitive)', () => {
    expect(isValidCodeFormat('abc123')).toBe(true);
    expect(isValidCodeFormat('AbC123')).toBe(true);
  });

  it('returns false for invalid codes', () => {
    expect(isValidCodeFormat('ABC12')).toBe(false); // Too short
    expect(isValidCodeFormat('ABC1234')).toBe(false); // Too long
    expect(isValidCodeFormat('ABC 12')).toBe(false); // Contains space
    expect(isValidCodeFormat('ABC-12')).toBe(false); // Contains special char
    expect(isValidCodeFormat('')).toBe(false); // Empty
  });
});
