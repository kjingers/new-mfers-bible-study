import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Get the next Tuesday (or today if it's Tuesday)
 */
export function getNextTuesday(from: Date = new Date()): Date {
  const date = new Date(from);
  date.setHours(0, 0, 0, 0);

  const dayOfWeek = date.getDay();
  // Tuesday is day 2
  const daysUntilTuesday = dayOfWeek <= 2 ? 2 - dayOfWeek : 9 - dayOfWeek;

  date.setDate(date.getDate() + daysUntilTuesday);
  return date;
}

/**
 * Check if a date is a Tuesday
 */
export function isTuesday(date: Date): boolean {
  return date.getDay() === 2;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

/**
 * Format a date as ISO date string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse an ISO date string to a Date object (in local timezone)
 */
export function parseISODate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(a: Date | string, b: Date | string): boolean {
  const dateA = typeof a === 'string' ? parseISODate(a) : a;
  const dateB = typeof b === 'string' ? parseISODate(b) : b;
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISODate(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  return isSameDay(date, new Date());
}

/**
 * Generate a random 6-character alphanumeric code
 */
export function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validate a 6-character code format
 */
export function isValidCodeFormat(code: string): boolean {
  return /^[A-Z0-9]{6}$/i.test(code);
}
