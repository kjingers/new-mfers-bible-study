'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, Badge, ThemeToggle } from '@/components/ui';
import { VerseText } from '@/components/verse';
import { useWeeks } from '@/hooks';
import { formatDate } from '@/lib/utils';
import type { WeekWithDetails } from '@/types';

function getWeekStatus(weekDate: string): 'past' | 'current' | 'upcoming' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(weekDate + 'T00:00:00');

  // Check if it's within the current week (Tuesday to Tuesday)
  const dayOfWeek = today.getDay();
  const daysSinceTuesday = dayOfWeek >= 2 ? dayOfWeek - 2 : dayOfWeek + 5;
  const lastTuesday = new Date(today);
  lastTuesday.setDate(today.getDate() - daysSinceTuesday);
  const nextTuesday = new Date(lastTuesday);
  nextTuesday.setDate(lastTuesday.getDate() + 7);

  if (date >= lastTuesday && date < nextTuesday) {
    return 'current';
  } else if (date < today) {
    return 'past';
  }
  return 'upcoming';
}

function WeekCard({
  week,
  isExpanded,
  onToggle,
}: {
  week: WeekWithDetails;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const status = getWeekStatus(week.date);

  const statusConfig = {
    current: { label: 'This Week', variant: 'success' as const, glow: true },
    upcoming: { label: 'Upcoming', variant: 'info' as const, glow: false },
    past: { label: 'Completed', variant: 'default' as const, glow: false },
  };

  const { label, variant, glow } = statusConfig[status];

  const bibleReadings = week.readings.filter((r) => r.type === 'bible');
  const bookReadings = week.readings.filter((r) => r.type === 'book');

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${
        glow ? 'ring-2 ring-amber-500/50 dark:ring-amber-400/30' : ''
      } ${status === 'past' ? 'opacity-75' : ''}`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset"
        aria-expanded={isExpanded}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-stone-900 dark:text-white">
                  Week {week.weekNumber}
                </h3>
                <Badge variant={variant}>{label}</Badge>
              </div>
              {week.title && (
                <p className="mt-1 text-sm font-medium text-amber-600 dark:text-amber-400 truncate">
                  {week.title}
                </p>
              )}
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                {formatDate(new Date(week.date), {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right text-sm text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1">
                  <span className="text-amber-600">📖</span>
                  <span>{bibleReadings.length}</span>
                </div>
                {bookReadings.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-blue-600">📚</span>
                    <span>{bookReadings.length}</span>
                  </div>
                )}
              </div>
              <svg
                className={`h-5 w-5 text-stone-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </button>

      {/* Expanded Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-stone-200 dark:border-stone-700 px-4 pb-4">
          {/* Bible Readings */}
          {bibleReadings.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-xs">
                  📖
                </span>
                Bible Readings
              </h4>
              <div className="space-y-2">
                {bibleReadings.map((reading) => (
                  <div
                    key={reading.id}
                    className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 border border-amber-200 dark:border-amber-800"
                  >
                    <p className="font-medium text-stone-800 dark:text-stone-200 font-serif">
                      <VerseText text={reading.reference} />
                    </p>
                    {reading.description && (
                      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                        {reading.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Book Readings */}
          {bookReadings.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs">
                  📚
                </span>
                Book Readings
              </h4>
              <div className="space-y-2">
                {bookReadings.map((reading) => (
                  <div
                    key={reading.id}
                    className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800"
                  >
                    <p className="font-medium text-stone-800 dark:text-stone-200">
                      {reading.reference}
                    </p>
                    {reading.description && (
                      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                        {reading.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View Full Details Link */}
          <Link
            href={`/week/${week.id}`}
            className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-stone-100 dark:bg-stone-800 px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors min-h-[44px]"
          >
            View Full Week Details
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </Card>
  );
}

function ReadingsSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 animate-pulse">
      <div className="h-20 bg-stone-200 dark:bg-stone-700 rounded-xl" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-24 bg-stone-200 dark:bg-stone-700 rounded-xl" />
      ))}
    </div>
  );
}

export default function ReadingsPage() {
  const { data, isLoading, error } = useWeeks();
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) {
        next.delete(weekId);
      } else {
        next.add(weekId);
      }
      return next;
    });
  };

  // Auto-expand current week on load
  const weeks = data?.data || [];
  const currentWeek = weeks.find((w) => getWeekStatus(w.date) === 'current');

  // Initialize expanded state with current week
  if (currentWeek && expandedWeeks.size === 0 && weeks.length > 0) {
    setExpandedWeeks(new Set([currentWeek.id]));
  }

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-900 has-bottom-nav">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/80 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/80">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-stone-900 dark:text-white">Readings</h1>
          <ThemeToggle size="sm" />
        </div>
      </header>

      {isLoading ? (
        <ReadingsSkeleton />
      ) : error ? (
        <div className="mx-auto max-w-2xl p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 dark:text-red-400">
                {error instanceof Error ? error.message : 'Failed to load readings'}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-4 p-4">
          {/* Study Info */}
          {data?.study && (
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                  {data.study.title}
                </h2>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                  {data.study.description}
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {weeks.length} weeks
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {weeks.filter((w) => getWeekStatus(w.date) === 'past').length} completed
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weeks List */}
          {weeks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-stone-500 dark:text-stone-400">No readings available yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {weeks.map((week) => (
                <WeekCard
                  key={week.id}
                  week={week}
                  isExpanded={expandedWeeks.has(week.id)}
                  onToggle={() => toggleWeek(week.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
